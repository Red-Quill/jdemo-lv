import Cookies from 'universal-cookie';
import User,{ noUser } from "juser";
import { jdebug, wait } from "jutils";
import type HttpService from "jhttp-client";



type onUserCallback = (user:User) => void;

class JUserClient {
	_httpService:HttpService;
	_currentUser:User;
	_onUserCallbacks:Set<onUserCallback>;
	_googleClientId:string;
	_reCaptchaId:string

	constructor(googleUsersId:string,reCaptchaId:string) {
		this._currentUser = noUser;
		this._onUserCallbacks = new Set();
		this._googleClientId = `${googleUsersId}.apps.googleusercontent.com`;
		this._reCaptchaId = reCaptchaId;
	};

	init = async(httpService:HttpService) => {
		this._httpService = httpService;
		await this._restoreUser();
		window.addEventListener("storage",(event) => {
			console.log(event);
			if(event.storageArea != localStorage) return;
			if(event.key === "user") this._retrieveUserFromLocalStorage();
		});
		this.refreshUserSessionLoop();
	};

	get currentUser():User {return this._currentUser;}
	get user():User {return this._currentUser;}
	get client_id() {return this._googleClientId;}
	get reCaptchaId() {return this._reCaptchaId;}

	// register with email & password
	// if succesfull, backend sends activation email to user
	register = async({ email,name,password,reCaptcha,termsAccepted }:{ email:string,name:string,password:string,reCaptcha:string,termsAccepted?:string }) => {
		console.log("--> JUserClient register");
		await this._httpService.post("/api/user/register",{ email,name,password,reCaptcha,...(termsAccepted ? { termsAccepted } : {}) });
		console.log("<-- JUserClient register");
	};

	// account activation, if successfull, user can login with his email & password
	activate = async(activationKey:string) => {
		console.log("--> JUserClient activate");
		await this._httpService.post("/api/user/activate",{ activationKey });
		console.log("<-- JUserClient activate");
	};

	login = async({ email,password }:{ email:string,password:string }) => {
		jdebug.message("--> JUserClient login");
		// @ts-ignore
		const response = await this._httpService.post("/api/user/login",{ email,password });
		console.log(response)
		const user = new User(response.data);
		this._setUser(user);
		jdebug.message("<-- JUserClient login");
	};

	// --> change email, if successful, backend sends user email verification link
	changeEmail = async(newEmail:string) => {
		//const oldEmail = this._currentUser.email;
		await this._httpService.post("/api/user/changeemail",{ newEmail });
	};

	verifyEmail = async(verificationKey:string) => {
		const response = await this._httpService.post("/api/user/verifyemail",{ verificationKey });
	};
	// <-- change email

	changeName = async(newName:string) => {
		console.log("changing name",newName)
		const response = await this._httpService.post("/api/user/changename",{ newName });
		console.log("lol",response)
		const newUser = new User(response.data);
		this._setUser(newUser);
	};

	changePassword = async(newPassword:string) => {
		const response = await this._httpService.post("/api/user/changepassword",{ newPassword });
		const newUser = new User(response.data);
		this._setUser(newUser);
	};

	// --> password reset
	resetPassword = async({ email,reCaptcha }:{ email:string,reCaptcha:string }) => {
		await this._httpService.post("/api/user/resetpassword",{ email,reCaptcha });
	};

	setNewPassword = async({ resetKey,password }) => {
		await this._httpService.post("/api/user/setnewpassword",{ resetKey,password });
	};
	// <-- password reset

	googleRegister = async({ token,termsAccepted }:{ token:string,termsAccepted?:string }) => {
		const response= await this._httpService.post("/api/user/googleregister",{ token,...(termsAccepted ? { termsAccepted } : {}) });
		const user = new User(response.data);
		this._setUser(user);
	};

	addGoogleLogin = async(token:string) => {
		const response= await this._httpService.post("/api/user/addgooglelogin",{ token });
		const user = new User(response.data);
		this._setUser(user);
	};

	removeGoogleLogin = async() => {
		const response= await this._httpService.post("/api/user/removegooglelogin",{});
		const user = new User(response.data);
		this._setUser(user);
	};
	
	googleLogin = async(token:string) => {
		const response= await this._httpService.post("/api/user/googlelogin",{ token });
		const user = new User(response.data);
		this._setUser(user);
	};
	
	logout = async() => {
		// notice that posting logout is not awaited (on purpose)
		try {
			this._httpService.post("/api/user/logout",true);
		} catch(error:any) {}
		this._resetUser();
	};

	// --> refresh session so it doesn't expire
	refreshUserSessionLoop = async() => {
		while(true) {
			await wait(90_000);
			try {
				await this.refreshUserSession();
				await wait(1_200_000); // 20 min
			} catch(error:any) {
				console.log("Couldn't refresh user session");
				console.log(error);
			}
		}
	};

	refreshUserSession = async() => {
		const cookies = new Cookies();
		if(!cookies.get("sessionId")) {
			if(this._currentUser._id !== "") this._resetUser();
			return;
		}
		const response = await this._httpService.get("/api/user/refresh");
		if(response.data._id === "") {
			this._resetUser();
			return;
		}
		console.log(response.data);
		const newUser = new User(response.data);
		this._setUser(newUser);
	};
	// <--

	// -->
	// Keep in-memry user data and localStorage in sync
	// used when login is called
	_setUser = (user:User) => {
		this._currentUser = user;
		this._storeUserToLocalStorage();
		this._emitUserChange();
	};

	// used when logout is called
	_resetUser = () => {
		const cookies = new Cookies();
		cookies.remove("sessionId");
		this._currentUser = noUser;
		this._resetUserLocalStorage();
		this._emitUserChange();
	};

	// used when module is (re)loaded
	_restoreUser = async() => {
		const cookies = new Cookies();
		const sessionId = cookies.get("sessionId");
		if(!sessionId) {
			this._resetUser();
			return;
		};

		// at first lets assume that session is still open
		this._retrieveUserFromLocalStorage();

		// try check that session is still open
		const response = await this._httpService.get("/api/user/current");
		// if server says that session is not there, then reset user
		if(!response.data._id) {
			this._resetUser();
			return;			
		};
		const user = new User(response.data);
		this._setUser(user);
	};

	// --> whenever user changes
	onUserChanged = (callback:onUserCallback) => this._onUserCallbacks.add(callback);
	offUserChanged = (callback:onUserCallback) => this._onUserCallbacks.delete(callback);
	_emitUserChange = () => this._onUserCallbacks.forEach((callback) => callback(this._currentUser));
	// <--

	// Technically naming conventions of this part could cause conflicts in unlikely scenarios
	_storeUserToLocalStorage = () => {
		if(!(this._currentUser instanceof User)) throw new Error("Hmmz")
		const userObject = this._currentUser._object;
		const userJSON = JSON.stringify(userObject);
		window.localStorage.setItem("user",userJSON);
	};
	
	_resetUserLocalStorage = () => {
		window.localStorage.setItem("user","");
	};
	
	_retrieveUserFromLocalStorage = () => {
		const userJSON = window.localStorage.getItem("user");
		const userObject = userJSON ? JSON.parse(userJSON) : {};
		this._currentUser = userObject._id ? new User(userObject) : noUser;
		this._emitUserChange();
	};
	// <--
}



export default JUserClient;
export type { onUserCallback };
