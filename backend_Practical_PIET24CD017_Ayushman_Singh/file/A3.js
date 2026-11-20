// A3.js - Task 2 test script: runs every scenario the exam asks screenshots for
// (register, login, /profile with & without token, /students as admin & as student)
// Run:  cd student-portal && npm install   (once)   then   node A3.js
const app = require('./student-portal/app');

let server, BASE;
async function call(method, path, { body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  console.log(`\n>>> ${method} ${path}${token ? '   [Authorization: Bearer <token>]' : ''}${body ? '   body: ' + JSON.stringify(body) : ''}`);
  console.log(`<<< ${res.status} ${res.statusText}`);
  console.log(JSON.stringify(data, null, 2).replace(/"token": "([^"]{25})[^"]*"/, '"token": "$1..."'));
  return data;
}

(async () => {
  server = app.listen(0);
  BASE = `http://localhost:${server.address().port}`;

  console.log('===== 1. REGISTER =====');
  await call('POST', '/register', { body: { name: 'Ayushman Singh', email: 'ayushman@piet.com', password: 'secret123', role: 'student' } });
  await call('POST', '/register', { body: { name: 'Admin User', email: 'admin@piet.com', password: 'admin123', role: 'admin' } });
  await call('POST', '/register', { body: { name: 'Dup', email: 'ayushman@piet.com', password: 'secret123' } });   // duplicate -> 409
  await call('POST', '/register', { body: { name: 'Bad', email: 'not-an-email', password: '123' } });             // invalid -> 400

  console.log('\n===== 2. LOGIN =====');
  const s = await call('POST', '/login', { body: { email: 'ayushman@piet.com', password: 'secret123' } });
  const a = await call('POST', '/login', { body: { email: 'admin@piet.com', password: 'admin123' } });
  await call('POST', '/login', { body: { email: 'ayushman@piet.com', password: 'wrongpass' } });                  // 401

  console.log('\n===== 3. /profile =====');
  await call('GET', '/profile');                                  // no token -> 401
  await call('GET', '/profile', { token: 'invalid.token.here' }); // bad token -> 401
  await call('GET', '/profile', { token: s.token });              // 200

  console.log('\n===== 4. /students =====');
  await call('GET', '/students', { token: s.token });             // student -> 403
  await call('GET', '/students', { token: a.token });             // admin -> 200

  server.close();
})();
