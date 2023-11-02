import { noUser } from "juser";
import User from "juser"
import { v4 as uuidv4 } from "uuid";



type sessionData = {
	_id:string;
	secureId:string;
	userId:string;
	expires:Date;
	updatedAt:Date; // mongoose uses this naming convention	
}

class Session {
	_id:string;
	_secureId:string;
	_user:User;
	_expires:Date;
	_updatedAt:Date; // mongoose uses this naming convention

	constructor(_id:string,secureId:string,user:User,expires:Date,updatedAt:Date) {
		this._id = _id;
		this._secureId = secureId;
		this._user = user;
		this._expires = expires;
		this._updatedAt = updatedAt;
	};

	static generate = (user:User,validTime:number) => {
		const date = Date.now();
		const expires = new Date(date + validTime);
		const updatedAt = new Date(date);
		const _id = uuidv4();
		const secureId = uuidv4();
		const session = new Session(_id,secureId,user,expires,updatedAt);
		return session;
	};

	static fromObject = async(_object:sessionData,getUser:(userId:string)=>User|Promise<User>) => {
		const { _id,userId,secureId,expires,updatedAt } = _object;
		const user = await getUser(userId);
		const session = new Session(_id,secureId,user,expires,updatedAt);
		return session;
	}

	refresh = (validTime:number) => {
		const date = Date.now();
		this._updatedAt = new Date(date);
		this._expires = new Date(date + validTime);
	};

	updateUser = (user:User) => {
		this._user = user;
		this._updatedAt = new Date();
	};

	get session() {return this};
	//get _id() {return this._id};
	get sessionId() {return this._id};
	get secureId() {return this._secureId};
	get user() {return this._user};
	get expires() {return this._expires};
	get updatedAt() {return this._updatedAt};
	get _object():sessionData {
		const _object = {
			_id: this._id,
			secureId: this._secureId,
			userId: this._user._id,
			expires: this._expires,
			updatedAt: this._updatedAt,
		};
		return _object;
	};
};

const noSessionDate = new Date(8640000000000000)
const noSession = new Session("","",noUser,noSessionDate,noSessionDate);



export default Session;
export { Session,noSession };
export type { sessionData };
