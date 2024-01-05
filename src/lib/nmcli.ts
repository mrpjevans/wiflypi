import { execSync } from "child_process";

export type NmcliConnection = {
	name?: string;
	uuid?: string;
	type?: string;
	device?: string;
};

export function getConnections(): NmcliConnection[] {
	const output = execSync("nmcli c").toString();

	const lines = output.split("\n");
	lines.shift();

	return lines.reduce((acc, line) => {
		const fields = line.replace(/\s+/g, " ").trim().split(" ");
		if (fields[0] === "") return acc;
		acc.push({
			name: fields[0],
			uuid: fields[1],
			type: fields[2],
			device: fields[3],
		});
		return acc;
	}, []);
}
