import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import JJoi from "jjoi";
import Verifier from "jrecaptcha";
//import type DatabaseManager from "../database/databaseManager";
import { InvalidPasswordException,InvalidResetkeyException } from "juser";
import type User from "juser";



/*
Manage passwords and other authentication methods
Designed to be independent of other user and session management
Only needs database manager as injected dependency
*/

const passwordSchema = {
	hashedPassword: { type:String,required:true },
};

const passwordResetSchema = {
	passwordId : { type:String,required:true,unique:true },
};

const passwordValidateSchema = JJoi.string().required().min(10).label("password");

const googleAuthClient = new OAuth2Client();

type AuthenticatorConstructor = {
	googleUserVerification:string;
	reCaptchaSecret:string;
}

class Authenticator {
	_dataBaseManager:any;
	_googleAudience:string;
	_reCaptchaVerifier:Verifier;
	_reCaptchaSercret:string;
	_passwords:any;
	_passwordresets:any;
	
	constructor({ googleUserVerification,reCaptchaSecret }:AuthenticatorConstructor) {
		this._googleAudience = googleUserVerification;
		this._reCaptchaSercret = reCaptchaSecret;
	};

	init = async(dataBaseManager:any) => {
		this._reCaptchaVerifier = new Verifier({ secret:this._reCaptchaSercret });
		this._dataBaseManager = dataBaseManager;
		this._passwords = await this._dataBaseManager.newTable("passwords",passwordSchema);
		this._passwordresets = await this._dataBaseManager.newTable("passwordresets",passwordResetSchema,600_000); //expires in 10 min
	};

	addPassword = async(plainTextPassword:string) => {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(plainTextPassword,salt);
		const { _id } = await this._dataBaseManager.save(this._passwords,{ hashedPassword });
		return _id;
	};

	removePassword = async(passwordId:string) => {
		await this._dataBaseManager.removeById(this._passwords,passwordId);
		return { removed:true };
	};

	verifyPassword = async(passwordId:string,plainTextPassword:string) => {
		const { hashedPassword } = await this._dataBaseManager.findById(this._passwords,passwordId);
		const correct = await bcrypt.compare(plainTextPassword,hashedPassword);
		return { correct };
	};



	resetPassword = async(resetKey:string,plainTextPassword:string) => {
		const dbResult = await this._dataBaseManager.removeById(this._passwordresets,resetKey);
		if(!dbResult) return { error:"Invalid or expired reset key" };
		const { passwordId } = await this.addPassword(plainTextPassword);
		await this.removePassword(dbResult.passwordId);
		return { passwordId };
	};



	assertUserPassword = (plainTextPassword:string) => {
		const { error } = JJoi.validate(plainTextPassword,passwordValidateSchema);
		if(error) throw new InvalidPasswordException(error.message);
		return { valid:true };
	};

	validateUserPassword = (x:string) => this.assertUserPassword(x);

	assertReCaptcha = async(reCaptcha:string) => {
		await this._reCaptchaVerifier.assert(reCaptcha);
	};

	verifyGoogleToken = async(token:string) => {
		//try {
			const ticket = await googleAuthClient.verifyIdToken({
				idToken : token,
				audience : this._googleAudience,
			});
			const payload = ticket.getPayload();
			return { payload };
		//} catch(error) {
		//	return { error };
		//}	
	};


	////////////////////////
	// --> reset password //
	////////////////////////
	startPasswordReset = async(passwordId:string) => {
		console.log("--> Authenticator startPasswordReset");
		const dbResult = await this._dataBaseManager.save(this._passwordresets,{ passwordId });
		console.log("<-- Authenticator startPasswordReset");
		return { resetKey:dbResult._id };
	};

	finalizePasswordReset = async(resetKey:string,plainTextPassword:string) => {
		const dbResult = await this._dataBaseManager.removeById(this._passwordresets,resetKey);
		if(!dbResult) throw new InvalidResetkeyException();
		const { passwordId } = dbResult;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(plainTextPassword,salt);
		const result2 = await this._dataBaseManager.save(this._passwords,{ password:hashedPassword });
		await this._dataBaseManager.removeOne(this._passwords,{ passwordId });
		return { passwordId:result2._id };
	};
	////////////////////////
	// <-- reset password //
	////////////////////////
};



export default Authenticator;
