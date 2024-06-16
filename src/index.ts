import hashGeerador from './functions/crypt';
export interface Env {
	DB: D1Database;
}


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return Response.json(
			{
				dataEncode: await hashGeerador()
			}
		)
	}
};
