import { execSync } from "child_process";
import {
	scanForWifiNetworksWithIw,
	connectToWifi,
	deleteConnection,
} from "../lib/nmcli";

export async function routes(fastify, _options) {
	fastify.get("/", async (_request, reply) => {
		return reply.view("src/web/templates/root.ejs", { page: "index" });
	});

	fastify.get("/ssids", (_request, reply) => {
		setTimeout(() => {
			const networks = scanForWifiNetworksWithIw("wlan0");
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
		try {
			deleteConnection(request.body.ssid);
		} catch (err) {}
		connectToWifi(request.body.ssid, request.body.password);
		execSync("sudo systemctl stop wifly_web.service");
		return;
	});
}
