import request from "supertest.js";
import JServer from "../../../../src/JServer.js";



describe("/api/user/current",() => {
	let jServer;

	it("starts jServer", async() =>{
		jServer = new JServer();
		await jServer.init();
	});
	
	it("stop jServer", async() =>{
		await jServer.stop();
	});
});
