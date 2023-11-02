import mongoose from "mongoose.js";
import DatabaseManager from "../../../src/database/databaseManager.js";



const databaseManager = new DatabaseManager("192.168.122.29","jdemo-testing");
const testSchema = new mongoose.Schema({
	testKey : { type:String,required:true },
})

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
