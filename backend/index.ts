import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';

const init = async() => {

  const server = Hapi.server({
    port: 3020,
    address: 'localhost',
    routes: {
      cors: {// TODO https://hapi.dev/api/?v=19.1.1#-routeoptionscors
        origin: ['http://localhost:3000']
      }
    }
  });

  server.validator(Joi);

  await server.register([
    { plugin: require('./controllers/file'), routes: { prefix: '/file' } }
  ]);

  await server.start();

  console.log('listening on port 3020')
}

init();

process.on('uncaughtException', (err) => {
  console.error(err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection occurred. Reason: ', reason);
});