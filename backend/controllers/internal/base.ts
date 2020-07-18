import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';


class BaseController {
  private server: Hapi.Server;
  constructor(server: Hapi.Server) {
    this.server = server;
  }

  protected get(path: string, handler: (req: Hapi.Request, res: Hapi.ResponseToolkit) => {}, options?: Hapi.RouteOptions) {
    this.server.route({ path, method: 'GET', handler: this.wrappedHandler(handler), options })
  };

  protected put(path: string, handler: (req: Hapi.Request, res: Hapi.ResponseToolkit) => {}, options?: Hapi.RouteOptions) {
    this.server.route({ path, method: 'PUT', handler: this.wrappedHandler(handler), options })
  };

  protected post(path: string, handler: (req: Hapi.Request, res: Hapi.ResponseToolkit) => {}, options?: Hapi.RouteOptions) {
    this.server.route({ path, method: 'POST', handler: this.wrappedHandler(handler), options })
  };

  protected delete(path: string, handler: (req: Hapi.Request, res: Hapi.ResponseToolkit) => {}, options?: Hapi.RouteOptions) {
    this.server.route({ path, method: 'DELETE', handler: this.wrappedHandler(handler), options })
  };

  private wrappedHandler(handler: (req: Hapi.Request, h: Hapi.ResponseToolkit) => {}){
    return (req: Hapi.Request, h: Hapi.ResponseToolkit) => {
      try {
        return handler(req, h);
      } catch (err) {
        console.error(err);
        if (Boom.isBoom(err)) {
          return err;
        } else {
          return Boom.internal();
        }
      }
    }
  }
}

export default BaseController;