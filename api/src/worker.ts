import { Hono } from 'hono';

import app from '@/index';

type Bindings = {
	MY_KV: KVNamespace;
	DB: D1Database;
};

const workers = new Hono<{ Bindings: Bindings }>(); // binding env value

workers.route('/api/v1', app);

export default workers;
