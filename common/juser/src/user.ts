import JJoi from "jjoi";



const userNameSchema = JJoi.string().required().min(3).label("name");

const userEmailSchema = JJoi.string().email({ tlds:{ allow:false } }).allow("").label("email");

const userGmailSchema = JJoi.string().email({ tlds:{ allow:false } }).allow("").label("gmail");

const userObjectSchema = JJoi.object().required().keys({
	_id : JJoi.string().guid().required(),
	name : userNameSchema,
	email : userEmailSchema,
	passwordId : JJoi.string().allow(""),
	googleId : JJoi.string().allow(""),
	gmail : userGmailSchema,
	admin : JJoi.boolean(),
	updatedAt : JJoi.date(),
	termsAccepted : JJoi.string().allow("").allow(null),
}).options({ allowUnknown:true });

type userData = {
	_id:string;
	name:string;
	email?:string;
	passwordId?:string;
	googleId?:string;
	gmail?:string;
	admin?:boolean;
	updatedAt?:Date|string;
	termsAccepted?:string;
}

class User {
	_id:string;
	_name:string;
	_email:string;
	_passwordId:string;
	_gmail:string;
	_googleId:string;
	_admin:boolean;
	_updatedAt:Date;
	_termsAccepted?:string;

	constructor(userObject:userData) {
		const { _id,name,email,passwordId="",googleId="",gmail="",admin=false,updatedAt,termsAccepted=null } = userObject;
		if(!(_id==="" && name==="" && email==="" && passwordId==="" && googleId==="" && admin===false)) JJoi.assert(userObject,userObjectSchema);
		this._id = _id;
		this._name = name;
		this._email = email;
		this._passwordId = passwordId;
		this._googleId = googleId;
		this._gmail = gmail;
		this._admin = admin;
		this._termsAccepted = termsAccepted;
		if(typeof updatedAt === "string") {
			this._updatedAt = new Date(updatedAt);
		} else if(updatedAt instanceof Date) {
			this._updatedAt = updatedAt;
		} else {
			//throw new Error("Invalid date field");
			this._updatedAt = new Date(); //TMP
		}
	};

	static validateEmail = (email:any) => {
		const { error } = JJoi.validate(email,userEmailSchema);
		if(error) return { error:error.message };
		return {};
	};

	static validateName = (name:any) => {
		const { error } = JJoi.validate(name,userNameSchema);
		if(error) return { error:error.message };
		return {};
	};

	get user() {return this}
	//get _id() {return this._id};
	get userId() {return this._id}
	get name() {return this._name}
	get email() {return this._email}
	get passwordId() {return this._passwordId}
	get googleId() {return this._googleId}
	get gmail() {return this._gmail;}

	get admin() {return this._admin}
	get updatedAt() {return this._updatedAt}
	get termsAccepted() {return this._termsAccepted;}
	get _object():userData {
		const userObject = {
			_id : this._id,
			name : this._name,
			email : this._email,
			passwordId : this._passwordId,
			googleId : this._googleId,
			admin : this._admin,
			updatedAt : this._updatedAt,
			...(this._termsAccepted ? { termsAccepted:this._termsAccepted } : {}),
		};
		return userObject;
	}
}

const noUser = new User({ _id:"",name:"",passwordId:"",googleId:"",email:"",updatedAt:new Date(0) });



export default User;
export { noUser };
export type { userData };
