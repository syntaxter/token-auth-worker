import { Hono } from 'hono'

const app = new Hono()

app.get('/token/:date', async (c) => {
  return c.text('Era el amor de mi vida ❤️!' + c.params?.date)
})

export default app
