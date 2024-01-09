import {
	scanForWifiNetworks,
	connectToWifi,
	deleteConnection,
} from "../lib/nmcli";

export async function routes(fastify, _options) {
	fastify.get("/", async (_request, reply) => {
		return reply.view("src/web/templates/root.ejs", { page: "index" });
	});

	fastify.get("/ssids", (_request, reply) => {
		setTimeout(() => {
			const networks = scanForWifiNetworks();
			return reply.view("src/web/templates/root.ejs", {
				page: "ssids",
				networks,
			});
		}, 2000);
	});

	fastify.get("/security", async (request, reply) => {
		return reply.view("src/web/templates/root.ejs", {
			page: "security",
			ssid: request.query.ssid,
		});
	});

	fastify.post("/confirm", async (request, reply) => {
		return reply.view("src/web/templates/root.ejs", {
			page: "confirm",
			...request.body,
		});
	});

	fastify.post("/connect", async (request, _reply) => {
		deleteConnection(request.body.ssid);
		const output = connectToWifi(request.body.ssid, request.body.password);
		return { body: request.body, output };
	});
}
