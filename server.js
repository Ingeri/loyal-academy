const { createServer } = require('node:http');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const hostname = '0.0.0.0';
const app = next({ dev: false, hostname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((request, response) => handle(request, response)).listen(port, hostname, () => {
    console.log(`Loyal Academy is running on http://${hostname}:${port}`);
  });
});
