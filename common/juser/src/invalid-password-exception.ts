import Exception,{ registerException } from "jexception";



class InvalidPasswordException extends Exception {
	static typeId = "bae62019-ac03-46e4-97f6-346e14c6513e";
	cause = "Invalid password";
	httpCode = 400;
}

registerException(InvalidPasswordException);



export default InvalidPasswordException;
