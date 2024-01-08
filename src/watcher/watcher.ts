import * as fs from "fs";
import { execSync } from "child_process";

import { pino } from "pino";

import * as defaults from "../config.json";
import {
	getConnections,
	createWifiConnection,
	NmcliConnection,
	startAP,
} from "../lib/nmcli";

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
		hotspotActive: connections.some(
			(connection) =>
				connection.name === config.hotspotName &&
				connection.device === config.wifiDevice,
		),
		hotspotExists: connections.some(
			(connection) => connection.name === config.hotspotName,
		),
	};
}

function startWeb() {
	execSync("sudo systemctl start wifly_web.service");
}

// function stopWeb() {
// 	execSync("sudo systemctl stop wifly_web.service");
// }

// Start
try {
	const connections = getConnectionStatus();

	if (!connections.hotspotExists) {
		log.info(`Hotspot '${config.hotspotName}' not found, creating...`);
		createWifiConnection({
			name: config.hotspotName,
			device: config.wifiDevice,
			ssid: config.hotspotSSID,
			password: config.hotspotPassword,
		});
		log.info(`Hotspot '${config.hotspotName}' created`);
	} else {
		log.debug(`Hotspot '${config.hotspotName}' found`);
	}

	if (!connections.wifi) {
		log.info(
			`No wifi connection, starting hotspot '${config.hotspotName}' and web server`,
		);
		startAP(config.hotspotName);
		startWeb();
	} else if (connections.hotspotActive) {
		log.info(`Hotspot '${config.hotspotName}' active`);
	} else {
		log.info(
			`Wifi connected to '${(connections.wifi as NmcliConnection).name}'`,
		);
	}
} catch (err) {
	log.error(err.message);
}
