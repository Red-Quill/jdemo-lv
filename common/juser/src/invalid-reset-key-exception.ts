import Exception,{ registerException } from "jexception";



class InvalidResetkeyException extends Exception {
	static typeId = "ec64a58e-d956-4fc2-80c0-6debe56ef788";
	cause = "Invalid reset key (possibly expired)";
	httpCode = 400;
}

registerException(InvalidResetkeyException);



export default InvalidResetkeyException;
