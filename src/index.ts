import { Hono } from 'hono';
const bcrypt = require('bcryptjs');

const app = new Hono()

app.post('/', async (c) => {
  const body:any = await c.req.json();
  return c.text(bcrypt.hashSync(body.email, 2));
});

export default app
