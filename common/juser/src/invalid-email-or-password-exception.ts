import Exception,{ registerException } from "jexception";



class InvalidEmailOrPasswordException extends Exception {
	static typeId = "699402b4-ca36-4733-af41-2ef626979625";
	cause = "Invalid email or password";
	httpStatus = 401;
}

registerException(InvalidEmailOrPasswordException);



export default InvalidEmailOrPasswordException;
