import config from "./jServerConfig.js";
import JServer from "./JServer.js";



const start = async() => {
	const jServerConfig = await config();
	const jServer = new JServer(jServerConfig);
	await jServer.init();
};

start();
