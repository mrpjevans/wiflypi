import * as fs from "fs";

const defaults = {
	wiredDevice: "eth0",
	wifiDevice: "wlan0",
	hotspotName: "hotspot",
	hotspotSSID: "hotspot",
	hotspotPassword: "password",
	logLevel: "debug",
	logPretty: true,
	port: 3000,
	name: "WiFly",
};

const envFile = `${__dirname}/../env.json`;
export const config = fs.existsSync(envFile)
	? { ...defaults, ...JSON.parse(fs.readFileSync(envFile, "utf-8")) }
	: defaults;
