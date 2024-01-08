import * as path from "path";

import Fastify from "fastify";
import * as fastifyStatic from "@fastify/static";
import * as fastifyView from "@fastify/view";
import * as fastifyForm from "@fastify/formbody";
import * as ejs from "ejs";

import { routes } from "./routes";

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyStatic, {
	root: path.join(__dirname, "static"),
	prefix: "/static/",
});

fastify.register(fastifyView, {
	engine: {
		ejs,
	},
});

fastify.register(fastifyForm);

fastify.register(routes);

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: "0.0.0.0" });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
