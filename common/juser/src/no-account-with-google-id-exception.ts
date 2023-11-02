import Exception,{ registerException } from "jexception";



class NoAccountWithGoogleIdException extends Exception {
	static typeId = "35a35975-9fa7-4af7-9275-918b8ad25c41";
	cause = "There is no account registered with that google id (yet)";
	httpStatus = 401;
}

registerException(NoAccountWithGoogleIdException);



export default NoAccountWithGoogleIdException;
