import { scanForWifiNetworks } from "../lib/nmcli";

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
}
