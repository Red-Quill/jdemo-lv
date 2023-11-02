import jwt from "jsonwebtoken";
import SessionManager from "../../../src/sessions/sessionManager.js";



const secretKey = crypto.randomBytes(32).toString("hex");
console.log("secretKey",secretKey);

describe("SessionManager.newUserSession", () => {

	it("Works", async() => {
		const authenticator = { verifyUserPassword:jest.fn().mockResolvedValue(true) };
		const userManager = { getUserIdByEmail:jest.fn().mockResolvedValue("123") };
		const sessionManager = new SessionManager();
		await sessionManager.init(authenticator,userManager,secretKey);

		const resultA = await sessionManager.newUserSession("a@b.com","pwd");

		expect(userManager.getUserIdByEmail.mock.calls[0][0]).toBe("a@b.com");
		expect(authenticator.verifyUserPassword.mock.calls[0][0]).toBe("123");
		expect(authenticator.verifyUserPassword.mock.calls[0][1]).toBe("pwd");

		const resultB = jwt.verify(resultA.sessionToken,secretKey);
		
		expect(resultB).toHaveProperty("sessionId");
	
		const resultC = await sessionManager.getSessionUserId(resultA.sessionToken);
		
		expect(resultC).toBe("123");
	});

	it("Says 'Invalid password'", async() => {
		const authenticator = { verifyUserPassword:jest.fn().mockResolvedValue(false) };
		const userManager = { getUserIdByEmail:jest.fn().mockResolvedValue("123") };
		const sessionManager = new SessionManager();
		await sessionManager.init(authenticator,userManager,secretKey);

		const resultA = await sessionManager.newUserSession("a@b.com","pwd");

		console.log(resultA);
		expect(resultA).toEqual({ error:"Invalid password" });
	});

	it("Says 'Invalid email'", async() => {
		const authenticator = { verifyUserPassword:jest.fn().mockResolvedValue(false) };
		const userManager = { getUserIdByEmail:jest.fn().mockResolvedValue("") };
		const sessionManager = new SessionManager();
		await sessionManager.init(authenticator,userManager,secretKey);

		const resultA = await sessionManager.newUserSession("a@b.com","pwd");

		expect(resultA).toEqual({ error:"Invalid email" });
	});
});

describe("SessionManager.getSessionUserId", () => {
	it("returns session id", async() => {
		const sessionManager = new SessionManager();
		await sessionManager.init(null,null,secretKey);
		sessionManager.sessions["567"] = "123";

		const sessionToken = jwt.sign({ sessionId:"567" },secretKey);
		const result = await sessionManager.getSessionUserId(sessionToken);

		expect(result).toBe("123");
	});

	it("returns empty string", async() => {
		const sessionManager = new SessionManager();
		await sessionManager.init(null,null,secretKey);

		const sessionToken = jwt.sign({ sessionId:"567" },secretKey);
		const result = await sessionManager.getSessionUserId(sessionToken);

		expect(result).toBe("");
	});
});

describe("SessionManager.closeSession", () => {
	it("closes session", async() => {
		const sessionManager = new SessionManager();
		await sessionManager.init(null,null,secretKey);
		sessionManager.sessions["567"] = "123";
	
		const sessionToken = jwt.sign({ sessionId:"567" },secretKey);
		await sessionManager.closeSession(sessionToken);
		const result = await sessionManager.getSessionUserId(sessionToken);
		
		expect(result).toBe("");
	});

	it("is okay even if session is not there", async() => {
		const sessionManager = new SessionManager();
		await sessionManager.init(null,null,secretKey);
	
		const sessionToken = jwt.sign({ sessionId:"567" },secretKey);
		await sessionManager.closeSession(sessionToken);
		const result = await sessionManager.getSessionUserId(sessionToken);
		
		expect(result).toBe("");
	});
});
