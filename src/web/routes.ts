import { execSync } from "child_process";
import {
	scanForWifiNetworksWithIw,
	connectToWifi,
	deleteConnection,
} from "../lib/nmcli";

export async function routes(fastify, _options) {
	fastify.get("/", async (_request, reply) => {
		return reply.view("index");
	});

	fastify.get("/ssids", (_request, reply) => {
		setTimeout(() => {
			const networks = scanForWifiNetworksWithIw("wlan0");
			return reply.view("ssids", { networks });
		}, 2000);
	});

	fastify.post("/confirm", async (request, reply) => {
		const ssid =
			request.body.hidden_ssid !== ""
				? request.body.hidden_ssid
				: request.body.ssid;
		return reply.view("confirm", { ssid, password: request.body.password });
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
