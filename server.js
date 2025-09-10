const { createServer } = require('http');  // Import Node's HTTP server
const next = require('next');              // Import Next.js framework

const dev = false;                         // Disable development mode (for production)
const app = next({ dev });                 // Create Next.js instance
const handle = app.getRequestHandler();    // Default request handler (handles pages, assets, API routes)

app.prepare().then(() => {
  createServer((req, res) => {             // Create HTTP server
    handle(req, res);                      // Pass all requests to Next.js
  }).listen(3001, (err) => {               // Listen on port 3001
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
