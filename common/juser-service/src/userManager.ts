import User,{ noUser,NoAccountWithGoogleIdException,UserExistsException,InvalidActivationKeyException,InvalidVerificationKeyException } from "juser";
//import { randomKey } from "../common/jcrypt.js";
//import type DatabaseManager from "../database/databaseManager.js";

// possibly tmp
import crypto from "node:crypto";
const randomKey = () => crypto.randomBytes(48).toString("hex");

/*
Contains logic for
 - adding, modifying and removing user data
 - getting users by id or email (or possibly by other unique identifiers)
 - caching users (later, because needs to stay up to date)
*/

const uniqueStringSchema = { type:String,unique:true };

const userSchema = {
	name : { type:String,required:true },
	email: { type:String,required:true,unique:true },
	passwordId : uniqueStringSchema,
	googleId : uniqueStringSchema,
	termsAccepted : String,
	admin : Boolean,
	userKey : String,
};

const emailChangesSchema = {
	userId : { type:String,required:true,unique:true },
	email : { type:String,required:true,unique:true },
	$expires : 1_200_000, // 20 min
};

type UserManagerConstructor = {
	consentRequired?:boolean;
};

class UserManager {
	_dataBaseManager:any;
	_userUpdatedCallbacks:{ [key:string]:Set<Function> };
	_consentRequired:boolean;

	_users:any;
	_usercandidates:any;
	_emailchanges:any;

	constructor({ consentRequired=false }:UserManagerConstructor) {
		this._userUpdatedCallbacks = {};
		this._consentRequired = consentRequired;
	};

	init = async(dataBaseManager:any) => {
		this._dataBaseManager = dataBaseManager;
		this._users = await this._dataBaseManager.newTable("users",userSchema);
		// users that need to activate their account
		this._usercandidates = await this._dataBaseManager.newTable("usercandidates",{ ...userSchema,$expires:1_200_000 }); // expires in 20 min
		this._emailchanges = await this._dataBaseManager.newTable("emailchanges",emailChangesSchema); // expires in 20 min
	};

	////////////////////////////////
	// --> user info and settings //
	////////////////////////////////
	getUserById = async(userId:string) => {
		const dbResult = await this._dataBaseManager.findByIdObject(this._users,userId);
		const user = dbResult ? new User(dbResult) : noUser;
		return user;
	};

	changeName = async({ userId }:User,name:string) => {
		const dbResult = await this._dataBaseManager.updateExistingGet(this._users,userId,{ $set:{ name } });
		const updatedUser = new User(dbResult);
		this._doUserUpdatedCallbacks(updatedUser)
		return updatedUser;
	};
	////////////////////////////////
	// <-- user info and settings //
	////////////////////////////////



	////////////////////////////////////
	// --> email+password credentials //
	////////////////////////////////////
	addUser = async(name:string,email:string,passwordId:string,termsAccepted?:string) => {
		console.log("--> UserManager addUser");
		this._assertAddUserArguments(name,email);
		this._assertConsent(termsAccepted);
		const userTest1 = await this._dataBaseManager.findOne(this._users,{ email });
		const userTest2 = await this._dataBaseManager.findOne(this._usercandidates,{ email });
		if(userTest1 || userTest2) throw new UserExistsException(email);
		const userKey = randomKey();
		const dbResult = await this._dataBaseManager.save(this._usercandidates,{ name,email,passwordId,userKey,termsAccepted });
		const user = new User(dbResult);
		console.log("<-- UserManager addUser");
		return user;
	};

	_assertAddUserArguments = (name:string,email:string) => {
		const { error:nameError="" } = User.validateName(name);
		const { error:emailError="" } = User.validateEmail(email);
		if(nameError || emailError)
			throw new Error(`${nameError} ${emailError}`);
	};

	activateUser = async(userId:string) => {
		const userData = await this._dataBaseManager.findByIdObject(this._usercandidates,userId);
		if(!userData) {
			const userTest = await this._dataBaseManager.findById(this._users,userId);
			// ?? any security implications? Someone could use this to fish account ids
			if(userTest) return;
			throw new InvalidActivationKeyException();
		};
		const user = new User(userData);
		await this._dataBaseManager.save(this._users,user._object);
		this._dataBaseManager.removeById(this._usercandidates,userId);
	};

	getUserByEmail = async(email:string) => {
		console.log("--> UserManager getUserByEmail");
		const dbResult = await this._dataBaseManager.findOneObject(this._users,{ email });
		const user = dbResult ? new User(dbResult) : noUser;
		console.log("<-- UserManager getUserByEmail");
		return user;
	};

	////////////////////////////////
	//// --> change credentials ////
	changeEmail = async({ userId }:User,email:string) => {
		const userTest = await this._dataBaseManager.findOne(this._users,{ email });
		if(userTest) throw new UserExistsException(email);
		const { _id:verificationKey } = await this._dataBaseManager.save(this._emailchanges,{ userId,email });
		return verificationKey;
	};

	verifyEmail = async(user:User,verificationKey:string) => {
		const dbResult = await this._dataBaseManager.findByIdObject(this._emailchanges,verificationKey);
		if(!dbResult) throw new InvalidVerificationKeyException();
		const { userId,email } = dbResult;
		if(user._id !== userId) throw new InvalidVerificationKeyException();
		const dbResult2 = await this._dataBaseManager.updateExistingGet(this._users,userId,{ $set:{ email } });
		this._dataBaseManager.removeById(this._emailchanges,verificationKey);
		const updatedUser = new User(dbResult2);
		this._doUserUpdatedCallbacks(updatedUser);
		return updatedUser;
	};

	changePasswordId = async({ userId }:User,passwordId:string) => {
		const dbResult = await this._dataBaseManager.updateExistingGet(this._users,userId,{ $set:{ passwordId } });
		const updatedUser = new User(dbResult);
		this._doUserUpdatedCallbacks(updatedUser)
		return updatedUser;
	};
	//// <-- change credentials ////
	////////////////////////////////

	////////////////////////////////////
	// <-- email+password credentials //
	////////////////////////////////////



	////////////////////////////
	// --> google credentials //
	////////////////////////////
	addGoogleUser = async(name:string,gmail:string,googleId:string,termsAccepted?:string) => {
		this._assertConsent(termsAccepted);
		const userTest1 = await this._dataBaseManager.findOneObject(this._users,{ googleId });
		// if user with googleId exists, then return it
		if(userTest1) {
			const user = new User(userTest1);
			return user;
		};
		const userTest2 = await this._dataBaseManager.findOne(this._users,{ gmail });
		if(userTest2) throw new UserExistsException(gmail);
		const userKey = randomKey();
		const dbResult = await this._dataBaseManager.save(this._users,{ name,gmail,userKey,googleId,termsAccepted });
		const user = new User(dbResult);
		return user;
	};

	getUserByGoogleId = async(googleId:string) => {
		const dbResult = await this._dataBaseManager.findOneObject(this._users,{ googleId });
		if(!dbResult) throw new NoAccountWithGoogleIdException();
		const user = new User(dbResult);
		return user;
	};

	getNoUser = () => noUser;

	setGoogleId = async({ userId }:User,googleId:string) => {
		const test = await this._dataBaseManager.exists(this._users,{ googleId });
		if(test) throw new Error("That google account is already connected to another account here");
		const dbResult = await this._dataBaseManager.updateExistingGet(this._users,userId,{ $set:{ googleId } });
		const updatedUser = new User(dbResult);
		this._doUserUpdatedCallbacks(updatedUser)
		return updatedUser;
	};

	removeGoogleId = async({ userId }:User) => {
		const dbResult = await this._dataBaseManager.updateExistingGet(this._users,userId,{ $set:{ googleId:"" } });
		const updatedUser = new User(dbResult);
		this._doUserUpdatedCallbacks(updatedUser)
		return updatedUser;
	};
	////////////////////////////
	// <-- google credentials //
	////////////////////////////



	_assertConsent = (termsAccepted:string) => {
		const now = Date.now();
		try {
			const time = Date.parse(termsAccepted);
			const diff = now-time;
			if(diff < -1_800_000 || diff > 90_000) throw null;
		} catch(error:any) {
			throw new Error("Invalid or expired consent");
		}
	};



	// --> callbacks for user update
	onUserUpdated = ({ userId }:User,callback:Function) => {
		if(!this._userUpdatedCallbacks[userId]) this._userUpdatedCallbacks[userId] = new Set();
		this._userUpdatedCallbacks[userId].add(callback);
	};

	offUserUpdated = ({ userId }:User,callback:Function) => {
		if(!this._userUpdatedCallbacks[userId]) return;
		this._userUpdatedCallbacks[userId].delete(callback);
	};

	_doUserUpdatedCallbacks = ({ user,userId }:User) => {
		if(!this._userUpdatedCallbacks[userId]) return;
		for(const callback of this._userUpdatedCallbacks[userId]) {
			callback(user);
		};
	};
	// <--
};



export default UserManager;

/*

*/
