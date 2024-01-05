/* eslint-disable no-console */
import { getConnectionStatus } from "../lib/nmcli";

try {
	const connections = getConnectionStatus();
	console.dir(connections, { depth: null });
} catch (err) {
	console.dir(err, { depth: null });
}
