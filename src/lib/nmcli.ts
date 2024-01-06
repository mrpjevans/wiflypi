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
