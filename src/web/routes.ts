export async function routes(fastify, _options) {
	fastify.get("/", async (_request, _reply) => {
		return { hello: "world" };
	});
}
