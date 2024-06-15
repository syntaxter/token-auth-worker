// Funcion para controlar el acceso de los clientes a las plataformas corporativas

export interface Env {
	DB: D1Database;
  }


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const data = await env.DB.prepare('SELECT * FROM tokens').all();
		return Response.json({
			status: 200,
			data: data,
		});
		// return new Response('Hello World!', { status: 404, headers: { 'Content-Type': 'application/json' } });
	},
};
