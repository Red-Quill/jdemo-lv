import Exception,{ registerException } from "jexception";



class NoSessionException extends Exception {
	static typeId = "c08f1eef-e0bc-493b-95b6-f4822d9036da";
	cause = "No user logged in";
	httpStatus = 401;
}

registerException(NoSessionException);



export default NoSessionException;
