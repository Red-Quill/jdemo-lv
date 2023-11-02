import mongoose from "mongoose.js";
import DatabaseManager from "../../../src/database/databaseManager.js";
import BlogManager from "../../../src/blogManagement/blogManager.js";



const databaseManager = new DatabaseManager("192.168.122.29","jdemo-testing");

describe("DatabaseManager", () => {	
	it("connects", async() => await databaseManager.connect());

	describe("newTable", () => {
		beforeEach(async() => await databaseManager.newTable("testCollection",testSchema));
		afterEach(async() => await databaseManager.dropTable("testCollection"));

		it("creates a new table", async() => {
			result = await databaseManager.save("testCollection",{ testKey : "test value" });
			
		});
	});

	it("disconnects", async() => await databaseManager.disconnect());
});
