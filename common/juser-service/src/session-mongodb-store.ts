import SessionStore from "./session-store";
import type { sessionData } from "./session";
import type { MongodbManager } from "jmongodb";



const sessionSchema = {
	secureId: { type:String,required:true,unique:true },
	userId : { type:String,required:true },
	expires : { type:Date,expires:10 },
	updatedAt : Date,
};

class SessionMongodbStore extends SessionStore {
	_databaseManager:MongodbManager;
	_tableName:string;
	_sessions:any;
	_onUserDeletion:()=>void;

	constructor(tableName:string) {
		super();
		this._tableName = tableName;
	};

	init = async(databaseManager:MongodbManager) => {
		this._databaseManager = databaseManager;
		this._sessions = await this._databaseManager.newTable(this._tableName,sessionSchema);
	};

	saveSessionData = async(sessionId:string,sessionData:sessionData) => {
		await this._databaseManager.save(this._sessions,sessionData);
	};

	updateSessionData = async(sessionId:string,sessionData:sessionData) => {
		await this._databaseManager.updateExisting(this._sessions,sessionId,sessionData);
	};

	removeSessionData = async(sessionId:string) => {
		await this._databaseManager.removeById(this._sessions,sessionId);
	};

	getSessionData = async(sessionId:string) => {
		const sessionData = await this._databaseManager.findByIdObject(this._sessions,sessionId);
		return sessionData;
	};
};



export default SessionMongodbStore;
export { SessionMongodbStore };
/*
*/
