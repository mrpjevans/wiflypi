import { execSync } from "child_process";

export type NmcliConnection = {
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

export type NmcliWifiConnection = {
	name: string;
	device: string;
	ssid: string;
	password: string;
};

export function createWifiConnection(opts: NmcliWifiConnection) {
	const output = execSync(
		`sudo nmcli con add con-name ${opts.name} ifname ${opts.device} type wifi ssid "${opts.ssid}" && \
		sudo nmcli con modify hotspot wifi-sec.key-mgmt wpa-psk && \
		sudo nmcli con modify hotspot wifi-sec.psk "${opts.password}"`,
	).toString();

	if (!output.includes("successfully added")) {
		throw new Error(output);
	}
}

export function startAP(name: string) {
	execSync(
		`sudo nmcli con modify ${name} 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared`,
	);
}
