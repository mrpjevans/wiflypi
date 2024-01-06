import * as fs from "fs";
import { pino } from "pino";

import * as defaults from "../config.json";
import { getConnections, NmcliConnection } from "../lib/nmcli";

const envFile = `${process.cwd()}/env.json`;
const config = fs.existsSync(envFile)
	? { ...defaults, ...JSON.parse(fs.readFileSync(envFile, "utf-8")) }
	: defaults;

const log = pino({
	...(config.logPretty && {
		transport: {
			target: "pino-pretty",
		},
	}),
	...(config.logLevel && {
		level: config.logLevel,
	}),
});

type ConnectionStatus = {
	connections: NmcliConnection[];
	wired: boolean;
	wifi: NmcliConnection | boolean;
	hotspotActive: boolean;
	hotspotExists: boolean;
};

function getConnectionStatus(): ConnectionStatus {
	log.info("Requesting current network connections");
	const connections = getConnections();

	return {
		connections,
		wired: connections.some(
			(connection) => connection.device === config.wiredDevice,
		),
		wifi:
			connections.find(
				(connection) => connection.device === config.wifiDevice,
			) || false,
		hotspotActive: connections.some((connection) => {
			connection.name === "hotspot" && connection.device === config.wifiDevice;
		}),
		hotspotExists: connections.some(
			(connection) => connection.name === config.hotspotName,
		),
	};
}

try {
	const connections = getConnectionStatus();
	log.info(connections);
} catch (err) {
	log.error(err.message);
}
