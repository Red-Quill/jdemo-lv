import JJoi from "jjoi";
import { noUser,NoSessionException,InvalidEmailOrPasswordException } from "juser";
import { matchExceptions } from "jexception";
//import type Emailer from "../emails/emailer";
import Authenticator from "./authenticator";
import SessionManager from "./sessionManager";
import UserManager from "./userManager";
import UserEmailSender from "./user-email-sender";
import type User from "juser";



type Request = {
	body:any;
	get:Function;
	cookies?:any;
};

type Response = {
	body:any;
	cookies?:any;
};

class UserApi {
	_userManager:UserManager;
	_sessionManager:SessionManager;
	_authenticator:Authenticator;
	_userEmailSender:UserEmailSender;

	constructor({ authentication,sessions,email,users }:any) {
		this._authenticator = new Authenticator(authentication);
		this._userManager = new UserManager(users);
		this._sessionManager = new SessionManager(sessions);
		this._userEmailSender = new UserEmailSender(email);
	}

	init = async(databaseManager:any,emailer:any) => {
		console.log("BEGIN: Initializing UserApi");
		await this._userManager.init(databaseManager);
		//await this._sessionManager.init(this._userManager);
		await this._sessionManager.init(this._userManager,databaseManager);
		await this._authenticator.init(databaseManager);
		await this._userEmailSender.init(emailer);
		console.log("END: UserApi initalized");
	};

	get sessionManager() {return this._sessionManager;}



	///////////////////////
	// --> user sessions //
	///////////////////////
	// --> session helpers
	_setUserSession = async(response:Response,user:User) => {
		const { sessionId,secureId,expires } = await this._sessionManager.newUserSession(user);
		if(!response.cookies) response.cookies = {};
		response.cookies.sessionId = { value:sessionId,secure:true,expires };
		response.cookies.secureId = { value:secureId,secure:true,httpOnly:true,expires };
	};

	_clearUserSession = async(request:Request,response:Response) => {
		const { sessionId,secureId } = request.cookies;
		this._sessionManager.closeUserSessionById(sessionId,secureId);
		if(!response.cookies) response.cookies = {};
		response.cookies.sessionId = null;
		response.cookies.secureId = null;
	};

	// public
	getCurrentUser = async(request:Request) => {
		const { sessionId,secureId } = request.cookies;
		if(!sessionId || !secureId) return noUser;
		let user:User = noUser;
		try {
			({ user } = await this._sessionManager.getUserSessionById(sessionId,secureId));
		} catch(exception:any) {
			matchExceptions(exception,
				NoSessionException,()=>{}
			);
		}
		return user;
	};

	// public
	getSessionUser = async(request:Request) => {
		const { sessionId,secureId } = request.cookies;
		if(!sessionId || !secureId) throw new NoSessionException();
		const { user } = await this._sessionManager.getUserSessionById(sessionId,secureId);
		return user;
	};
	// <-- session helpers

	// --- refresh user session (expand expiration time)

	refresh_GET = async(request:Request) => {
		const { sessionId,secureId } = request.cookies;
		if(!sessionId || !secureId) throw new NoSessionException();
		const { expires,user } = await this._sessionManager.refreshSessionById(sessionId,secureId);
		const response = {
			cookies : {
				sessionId : { value:sessionId,secure:true,expires },
				secureId : { value:secureId,secure:true,httpOnly:true,expires },
			},
			body : user._object,
		};
		return response;
	};
	///////////////////////
	// <-- user sessions //
	///////////////////////



	// --> reCaptcha verify // Is this needed here???
	assertReCaptcha = async(reCaptcha:string) => await this._authenticator.assertReCaptcha(reCaptcha);
	// <-- reCaptcha verify



	////////////////////////////////
	// --> user info and settings //
	////////////////////////////////
	changename_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			newName : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	changename_POST = async(request:Request) => {
		const user = await this.getSessionUser(request);
		const { newName } = request.body;
		const { _object:newUserObject } = await this._userManager.changeName(user,newName);
		const response = { body:newUserObject };
		return response;
	};
	////////////////////////////////
	// <-- user info and settings //
	////////////////////////////////



	////////////////////////////////////
	// --> email+password credentials //
	////////////////////////////////////
	register_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			name : JJoi.string().required(),
			email : JJoi.string().required(),
			password : JJoi.string().required(),
			reCaptcha : JJoi.string().required(),
			termsAccepted : JJoi.string(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	register_POST = async(request:Request) => {
		console.log("--> UserApi register_POST");
		const { name,email,password,reCaptcha,termsAccepted } = request.body;
		const host = request.get("host");
		await this._authenticator.assertReCaptcha(reCaptcha);
		const passwordId = await this._authenticator.addPassword(password);
		const user = await this._userManager.addUser(name,email,passwordId,termsAccepted);
		this._userEmailSender.sendActivationLink(email,host,user._id); // no need to await
		console.log("<-- UserApi register_POST");
		return {};
	};

	// --- activate registered account

	activate_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			activationKey : JJoi.string().guid().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	activate_POST = async(request:Request) => {
		const { activationKey } = request.body;
		await this._userManager.activateUser(activationKey);
		return {};
	};

	// ---

	login_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			email : JJoi.string().required(),
			password : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	login_POST = async(request:Request) => {
		const { email,password } = request.body;
		const { user,userId,passwordId,_object:userObject } = await this._userManager.getUserByEmail(email);
		if(!(userId && passwordId)) throw new InvalidEmailOrPasswordException();
		const { correct } = await this._authenticator.verifyPassword(passwordId,password);
		if(!correct) throw new InvalidEmailOrPasswordException();
		const response = { body:userObject };
		await this._setUserSession(response,user);
		return response;
	};

	////////////////////////////////
	//// --> change credentials ////

	//// change email of existing user
	changeemail_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			newEmail : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	changeemail_POST = async(request:Request) => {
		const user = await this.getSessionUser(request);
		const { newEmail } = request.body;
		const host = request.get("host");
		const verificationKey = await this._userManager.changeEmail(user,newEmail);
		this._userEmailSender.sendEmailVerification(newEmail,host,verificationKey); // no need to await
		return {};
	};

	//// ---

	// verify new email for existing user
	verifyemail_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			verificationKey : JJoi.string().guid().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	verifyemail_POST = async(request:Request) => {
		const user = await this.getSessionUser(request);
		const { verificationKey } = request.body;
		const { _object:newUserObject } = await this._userManager.verifyEmail(user,verificationKey);
		const response = { body:newUserObject };
		return response;
	};

	//// ---

	changepassword_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			oldPassword : JJoi.string().required(),
			newPassword : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	changepassword_POST = async(request:Request) => {
		const { user,passwordId:oldPasswordId } = await this.getSessionUser(request);
		const { newPassword,oldPassword } = request.body;
		await this._authenticator.verifyPassword(oldPasswordId,oldPassword);
		this._authenticator.assertUserPassword(newPassword);
		const newPasswordId = await this._authenticator.addPassword(newPassword);
		const { _object:newUserObject } = await this._userManager.changePasswordId(user,newPasswordId);
		this._authenticator.removePassword(oldPasswordId); // no need to await
		const response = { body:newUserObject };
		return response;
	};

	//// ---

	removepassword_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			oldPassword : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	removepassword_POST = async(request:Request) => {
		const { user,passwordId:oldPasswordId } = await this.getSessionUser(request);
		const { oldPassword } = request.body;
		await this._authenticator.verifyPassword(oldPasswordId,oldPassword);
		await this._authenticator.removePassword(oldPasswordId);
		const { _object:newUserObject } = await this._userManager.changePasswordId(user,"");
		const response = { body:newUserObject };
		return response;
	};

	//// <-- change credentials ////
	////////////////////////////////

	//////////////////////////////////////
	//// --> reset forgotten password ////

	resetpassword_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			email : JJoi.string().email().required(),
			reCaptcha : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	resetpassword_POST = async(request:Request) => {
		console.log("--> UserApi reset password");
		const { email,reCaptcha } = request.body;
		await this._authenticator.assertReCaptcha(reCaptcha);
		const { userId,passwordId } = await this._userManager.getUserByEmail(email);
		if(!userId) return {}; // this is vague on purpose to increase security
		const { resetKey } = await this._authenticator.startPasswordReset(passwordId); // set password to be a candidate for reset
		this._userEmailSender.sendPasswordResetLink(email,"localhost:3000",resetKey); // no need to await
		console.log("<-- UserApi reset password");
		return {};
	};

	//// --- replace forgotten password

	setnewpassword_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			resetKey : JJoi.string().guid().required(),
			password : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	setnewpassword_POST = async(request:Request) => {
		const { resetKey,password } = request.body;
		this._authenticator.assertUserPassword(password);
		await this._authenticator.finalizePasswordReset(resetKey,password);
		return {};
	};

	//// <-- reset forgotten password ////
	//////////////////////////////////////

	////////////////////////////////////
	// <-- email+password credentials //
	////////////////////////////////////



	////////////////////////////
	// --> google credentials //
	////////////////////////////
	
	googleregister_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			token : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });
		
	googleregister_POST = async(request:Request) => {
		const { token,termsAccepted } = request.body;
		const { payload } = await this._authenticator.verifyGoogleToken(token);
		// @ts-ignore
		const { email:gmail,name,sub:googleId } = payload;
		// if user with googleId already exists, then addUser returns it
		const { user,_object:userObject } = await this._userManager.addGoogleUser(name,gmail,googleId,termsAccepted);
		const response = { body:userObject };
		await this._setUserSession(response,user);
		return response;
	};

	// ---

	googlelogin_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			token : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	googlelogin_POST = async(request:Request) => {
		const { token } = request.body;
		const { payload } = await this._authenticator.verifyGoogleToken(token);
		// @ts-ignore // TODO
		const { user,_object:userObject } = await this._userManager.getUserByGoogleId(payload.sub);
		const response = { body:userObject }
		this._setUserSession(response,user);
		return response;
	};

	// --- add google credentials to existing user

	addgooglelogin_validate:any = JJoi.object().required().keys({
		body : JJoi.object().required().keys({
			token : JJoi.string().required(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	/* add google login to existing user */
	addgooglelogin_POST = async(request:Request) => {
		const user = await this.getSessionUser(request);
		const { token } = request.body;
		const { payload } = await this._authenticator.verifyGoogleToken(token);
		// @ts-ignore
		const { sub:googleId } = payload;
		// modifies existing user object
		const { _object:newUserObject } = await this._userManager.setGoogleId(user,googleId);
		const response = { body:newUserObject };
		return response;
	};

	// --- remove google credentials from user

	removegooglelogin_POST = async(request:Request) => {
		const user = await this.getSessionUser(request);
		// modifies existing user object
		const { _object:newUserObject } = await this._userManager.removeGoogleId(user);
		const response = { body:newUserObject };
		return response;
	};

	////////////////////////////
	// <-- google credentials //
	////////////////////////////
}



export default UserApi;

/*

*/