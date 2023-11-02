import SessionFileStore from "./session-file-store.js";
import Session from "./session.js";
import { NoSessionException } from "juser";
import type { User } from "juser";
import type UserManager from "./userManager.js";
import { matchExceptions } from "jexception";
import type SessionStore from "./session-store.js";
import type { MongodbManager } from "jmongodb";
import SessionMongodbStore from "./session-mongodb-store.js";



/*
Session manager with in-memory write- and read-through caching capabilities
*/

type SessionManagerConstructor = {
	sessionFileStorePath?:string;
	sessionDatabaseTableName?:string;
	sessionLength:number;
	refreshInterval:number;
};

type SessionStorage = { [sessionId:string]:Session };

class SessionManager {
	_userManager:UserManager;
	_sessionStore:SessionStore;
	_sessionFileStorePath:string;
	_sessionDatabaseTableName:string;
	_sessionDatabase:any;
	_sessionLength:number;
	_refreshInterval:number;
	// --> in-memory cache of sessions
	_sessions:SessionStorage;
	_sessionsByUserId:{ [userId:string]:SessionStorage };
	// <--

	constructor({ sessionFileStorePath,sessionDatabaseTableName="sessions",sessionLength=10_800_000,refreshInterval=300_000 }:SessionManagerConstructor) {
		this._sessionFileStorePath = sessionFileStorePath;
		this._sessionDatabaseTableName = sessionDatabaseTableName;
		this._sessionLength = sessionLength;
		this._refreshInterval = refreshInterval;
		this._sessions = {};
		this._sessionsByUserId = {};
	};

	init = async(userManager:UserManager,databaseManager?:MongodbManager) => {
		this._userManager = userManager;
		if(databaseManager) {
			console.log("BEGIN: Initializin session database");
			this._sessionStore = new SessionMongodbStore(this._sessionDatabaseTableName);
			await this._sessionStore.init(databaseManager);
			console.log("END: session database ready")
		} else {
			console.log("BEGIN: Initializing session file store")
			this._sessionStore = new SessionFileStore(this._sessionFileStorePath);
			await this._sessionStore.init();
			console.log("END: session file store ready")
		}
		//setInterval(this._cleanSessions,90_000);
	};

	close = async() => {
	};

	// returns valid session or throws error
	// no need to return exceptions or errors
	newUserSession = async({ user,userId }:User) => {
		const { session,sessionId,_object } = Session.generate(user,this._sessionLength);
		this._sessions[sessionId] = session;
		if(!this._sessionsByUserId[userId]) this._sessionsByUserId[userId] = {};
		this._sessionsByUserId[userId][sessionId] = session;
		this._sessionStore.saveSessionData(sessionId,_object);
		return session;
	};

	closeUserSessionById = async(sessionId:string,secureId:string) => {
		try {
			const { user:{ userId } } = await this.getUserSessionById(sessionId,secureId);
			delete this._sessionsByUserId[userId][sessionId];
			delete this._sessions[sessionId];
			this._sessionStore.removeSessionData(sessionId);
		} catch(exception:any) {
			matchExceptions(exception,
				NoSessionException,()=>{} 
			);
		}
	};

	// reset expiration & return new session object
	refreshSessionById = async(sessionId:string,secureId:string) => {
		const { session,_object } = await this.getUserSessionById(sessionId,secureId);
		session.refresh(this._sessionLength);
		this._sessionStore.updateSessionData(sessionId,_object);
		return session;
	};

	getUserSessionById = async(sessionId:string,secureId:string) => {
		if(this._sessions[sessionId]) return this._checkUserSessionSecureId(this._sessions[sessionId],secureId);
		const session = await this._retrieveSessionFromStore(sessionId); // throws error if not found
		return this._checkUserSessionSecureId(session,secureId);
	};

	_retrieveSessionFromStore = async(sessionId:string) => {
		const { session,user:{ userId } } = await this._getSession(sessionId);
		this._sessions[sessionId] = session;
		if(!this._sessionsByUserId[userId]) this._sessionsByUserId[userId] = {};
		this._sessionsByUserId[userId][sessionId] = session;
		return session;
	};

	_getSession = async(sessionId:string) => {
		const _object = await this._sessionStore.getSessionData(sessionId);
		if(!_object) throw new NoSessionException();
		const session = await Session.fromObject(_object,this._userManager.getUserById);
		return session;
	};

	_checkUserSessionSecureId = async({ session,secureId }:Session,_secureId:string) => {
		if(secureId !== _secureId) throw new NoSessionException();
		return session;
	};



	// --> if user manager updates user, this callback is run
	_updateUser = async({ user,_id:userId }:User) => {
		const userSessions = this._sessionsByUserId[userId];
		if(!userSessions) return;
		for(const { session,sessionId } of Object.values(userSessions)) {
			session.updateUser(user);
			this._sessionStore.updateSessionData(sessionId,session._object); // changed updatedAt
		};
	};
	// <--


	_cleanSessions = async() => {
		// start by checking cached
		const now = new Date();
		for(const { sessionId,expires,user:{ userId } } of Object.values(this._sessions)) {
			if(expires < now) {
				delete this._sessions[sessionId];
				delete this._sessionsByUserId[userId][sessionId];
			}
		}
	};
};



export default SessionManager;
export { SessionManager };

/*

	// (periodically) read all session files and remove expired
	_syncAndCleanSessions = async() => {
		// start by checking cached
		const now = new Date();
		for(const { sessionId,updatedAt,user:{ user,_id:userId } } of Object.values(this._sessions)) {
			const fileName = `${sessionId}.json`;
			const data = await this._sessionStore.readJSONNoError(fileName);
			if(!data) {
				delete this._sessions[sessionId];
				delete this._sessionsByUserId[userId][sessionId];
			} else if(data.expires < now) {
				delete this._sessions[sessionId];
				delete this._sessionsByUserId[userId][sessionId];
				this._sessionStore.removeFile(fileName,{ throwError:false });
			} else if(updatedAt !== data.updatedAt) {
				const updatedSession = Session.fromObject(data,user);
				this._sessions[sessionId] = updatedSession;
				this._sessionsByUserId[userId][sessionId] = updatedSession;
			}
		}

		// clear session files that are not cached here
		const savedSessions = await this._sessionStore.readDirectory();
		for(const fileName of savedSessions) {
			const data = await this._sessionStore.readJSONNoError(fileName);
			if(data.expires < now) {
				this._sessionStore.removeFile(fileName,{ throwError:false });
			}
		}		
	};

*/
