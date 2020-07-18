import fs from 'fs';
import Boom from '@hapi/boom';

const FILES_BASE_DIR = 'files';
enum FILE_TYPES {
  dir,
  file
}

export const getFilesList = (username: string, path: string = '', filter?: any) => {
  path = path && path[0] !== '/' ? `/${path}` : path;
  const fullPath = `${FILES_BASE_DIR}/${username}${path}`;
  const dir = fs.opendirSync(fullPath);
  
  let entry = dir.readSync();
  let entries: any = {};  

  while (entry) {
    if (entry.isFile()) {
      const stat = fs.statSync(`${fullPath}/${entry.name}`);
      entries[entry.name] = {
        type: FILE_TYPES.file,
        path: fullPath,
        name: entry.name,
        size: stat.size,
        creationTime: stat.ctimeMs,
        modifiedTtime: stat.mtimeMs
      };
    } else if (entry.isDirectory()) {
      entries[entry.name] = {
        type: FILE_TYPES.dir,
        ...getFilesList(username, `${path}/${entry.name}`, filter)
      };
    };
    // Get next file/folder in dir
    entry = dir.readSync();
  };

  return entries;
}


const _preFileStuff = (username: string, filename: string) => {
  if (filename[0] === '/') {
    filename = filename.slice(1);
  };
  const fullFilename = `${FILES_BASE_DIR}/${username}/${filename}`;

  return fullFilename;
}


const _preFileRead = (username: string, filename: string) => {
  const fullFilename = _preFileStuff(username, filename);

  if (!fs.existsSync(fullFilename)) {
    throw Boom.notFound(`File "${filename}" does not exist`);
  }

  return fullFilename;
}


const _preFileWrite = (username: string, filename: string) => {
  const fullFilename = _preFileStuff(username, filename);

  const path = fullFilename.substr(0, fullFilename.lastIndexOf('/'));
  fs.mkdirSync(path, { recursive: true });

  return fullFilename;
}


export const getFileReadStream = (username: string, filename: string) => {
  const fullFilename = _preFileRead(username, filename);

  return fs.createReadStream(fullFilename);
}


export const getFileWriteStream = (username: string, filename: string) => {
  const fullFilename = _preFileWrite(username, filename);

  return fs.createWriteStream(fullFilename);

}


export const checkFileExists = (username: string, filename: string) => {
  const fullFilename = _preFileStuff(username, filename);

  return fs.existsSync(fullFilename);
}

