import type { sessionData } from "./session";



class SessionStore {
	init:(...args:any[]) => Promise<void>;
	saveSessionData:(sessionId:string,sessionData:sessionData) => Promise<void>;
	updateSessionData:(sessionId:string,sessionData:sessionData) => Promise<void>;
	removeSessionData:(sessionId:string) => Promise<void>;
	getSessionData:(sessionId:string) => Promise<sessionData|null>;
}



export default SessionStore;
