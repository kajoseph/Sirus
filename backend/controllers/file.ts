import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Base from './internal/base';
import * as fileHelpers from '../methods/file';
import { Readable } from 'stream';

class FileController extends Base {
  constructor(server: Hapi.Server) {
    super(server);

    this.get('/getList', this.getList)
    this.post('/download', this.downloadFile);
    this.post('/upload', this.uploadFile, { payload: { output: 'stream', maxBytes: 1000 * 1000* 1000* 10 } })

  }

  getList(req: Hapi.Request, h: Hapi.ResponseToolkit) {
    return fileHelpers.getFilesList('testy');
  }

  downloadFile(req: Hapi.Request, h: Hapi.ResponseToolkit) {
    const payload = req.payload as { filename: string };
    const fileStream = fileHelpers.getFileReadStream('testy', payload.filename);
      
    const r = req.generateResponse(fileStream, { variety: 'file' });
    return r;
  }

  uploadFile(req: Hapi.Request, h: Hapi.ResponseToolkit) {
    const payload = req.payload as Readable;
    const fileStream = fileHelpers.getFileWriteStream('testy', req.headers.filename);
    payload.pipe(fileStream);
    payload.read();
    return h.continue;
  }
}

exports.plugin = {
  name: 'file',
  register: (server: Hapi.Server, options: Hapi.RouteOptions) => {
    new FileController(server);
  }
}