import { Hono } from 'hono';
import { cors } from 'hono/cors';

import indexRouter from '@/routes';
import eventRouter from '@/routes/event';


type Bindings = {
  MY_KV: KVNamespace
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>() // binding env value

app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:5173', 'http://localhost:8787'],
	})
);

app.route('/', indexRouter);
app.route('/events', eventRouter);

export default app;
