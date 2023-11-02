import Exception,{ registerException } from "jexception";



class InvalidVerificationKeyException extends Exception {
	static typeId = "9f9e3c30-f874-4cef-bdfc-d24d8bc2ba6a";
	cause = "Invalid verification key";
	httpStatus = 400;
}

registerException(InvalidVerificationKeyException);



export default InvalidVerificationKeyException;
