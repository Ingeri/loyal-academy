const { createServer } = require('node:http');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const hostname = '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((request, response) => {
      handle(request, response).catch((error) => {
        console.error(error);
        response.statusCode = 500;
        response.end('Internal Server Error');
      });
    }).listen(port, hostname, () => {
      console.log(`Loyal Academy is running on http://${hostname}:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start Next.js:', error);
    process.exitCode = 1;
  });
