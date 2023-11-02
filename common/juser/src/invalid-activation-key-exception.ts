import Exception,{ registerException } from "jexception";



class InvalidActivationKeyException extends Exception {
	static typeId = "55e35d29-b434-41d2-966a-402c3b5cb066";
	cause = "Faulty or expired activation key";
	httpStatus = 400;
}

registerException(InvalidActivationKeyException);



export default InvalidActivationKeyException;
