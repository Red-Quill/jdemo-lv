import SessionStore from "./session-store";
import FileManager from "jfiles";
import type { sessionData } from "./session";



class SessionFileStore extends SessionStore {
	_fileManager:FileManager;

	constructor(sessionStorePath:string) {
		super();
		this._fileManager = new FileManager(sessionStorePath);
	};

	init = async() => {
		await this.cleanSessions();
		setInterval(this.cleanSessions,600_000);
	};

	saveSessionData = async(sessionId:string,sessionData:sessionData) => {
		await this._fileManager.writeJSON(`${sessionId}.json`,sessionData);
	};

	updateSessionData = async(sessionId:string,sessionData:any) => await this.saveSessionData(sessionId,sessionData);

	removeSessionData = async(sessionId:string) => {
		await this._fileManager.removeFile(`${sessionId}.json`,{ throwError:false });
	};

	getSessionData = async(sessionId:string):Promise<sessionData|null> => {
		const fileName = `${sessionId}.json`;
		const sessionDataRaw:any = await this._fileManager.readJSONNoError(fileName);
		if(!sessionDataRaw) return null;
		const expires = new Date(sessionDataRaw.expires);
		if(expires < new Date()) {
			this._fileManager.removeFile(fileName,{ throwError:false });
			return null;
		}
		const updatedAt = new Date(sessionDataRaw.updatedAt);
		const { _id,secureId,userId } = sessionDataRaw;
		const sessionData = { _id,secureId,userId,expires,updatedAt };
		return sessionData;
	};

	cleanSessions = async() => {
		const now = new Date();
		const savedSessions = await this._fileManager.readDirectory();
		for(const fileName of savedSessions) {
			const sessionDataRaw = await this._fileManager.readJSONNoError(fileName);
			if(sessionDataRaw && (new Date(sessionDataRaw.expires) < now)) {
				this._fileManager.removeFile(fileName,{ throwError:false });
			}
		}		
	};
};





export default SessionFileStore;
export { SessionFileStore as SessionManager };
/*
*/
