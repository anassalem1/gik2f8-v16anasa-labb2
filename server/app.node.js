const http = require('http');

const server = http.createServer((req, res) => {
  console.log(http.METHODS);
  const statusCode = 425;
  res.writeHead(statusCode);
  res.end(`You made one ${req.method} call to ${req.url}`);
});

server.listen('5000', () => console.log('Server running on http://localhost:5000'));