// demo.js - hits every endpoint of the Library API and prints status + response (like Postman)
const { start } = require('./server');

const BASE = `http://localhost:${process.env.PORT || 3000}`;
async function call(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = text; try { data = JSON.parse(text); } catch (e) {}
  console.log(`\n>>> ${method} ${path}${body ? '   body: ' + JSON.stringify(body) : ''}`);
  console.log(`<<< ${res.status} ${res.statusText}`);
  console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  return data;
}

(async () => {
  await start();
  const b1 = await call('POST', '/books', { title: 'Clean Code', author: 'Robert C. Martin', price: 450, category: 'Programming' });
  await call('POST', '/books', { title: 'Node.js in Action', author: 'Mike Cantelon', price: 380, category: 'Web' });
  await call('POST', '/books', { author: 'No Title', price: 0 });               // invalid -> 400
  await call('GET', '/books');
  await call('GET', `/books/${b1._id}`);
  await call('PUT', `/books/${b1._id}`, { price: 500, isAvailable: false });
  await call('GET', '/books/64b7f0c2a1b2c3d4e5f60789');                         // not found -> 404
  await call('GET', '/books/abc');                                              // bad id -> 400
  await call('DELETE', `/books/${b1._id}`);
  await call('GET', `/books/${b1._id}`);                                        // deleted -> 404
  process.exit(0);
})();
