import { execSync } from "child_process";

type NmcliConnectionStatus = {
	connections: NmcliConnection[];
	wired: boolean;
	wifi: NmcliConnection | boolean;
	hotspotActive: boolean;
	hotspotExists: boolean;
};

type NmcliConnection = {
	name: string;
	uuid?: string;
	type?: string;
	device?: string;
};

export function getConnections(): NmcliConnection[] {
	const output = execSync("nmcli -t c").toString();

	const lines = output.split("\n");
	lines.pop();

	return lines.map((line) => {
		const fields = line.split(":");
		return {
			name: fields[0],
			uuid: fields[1],
			type: fields[2],
			device: fields[3],
		};
	});
}

export function getConnectionStatus(): NmcliConnectionStatus {
	const connections = getConnections();

	return {
		connections,
		wired: connections.some((connection) => connection.device === "eth0"),
		wifi:
			connections.find((connection) => connection.device === "wlan0") || false,
		hotspotActive: connections.some((connection) => {
			connection.name === "hotspot" && connection.device === "wlan0";
		}),
		hotspotExists: connections.some(
			(connection) => connection.name === "hotspot",
		),
	};
}
