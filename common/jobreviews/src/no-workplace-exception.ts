import Exception,{ registerException } from "jexception";



class NoWorkplaceException extends Exception {
	static typeId = "584f8d9e-6f8b-442e-b11f-359e71a1ff23";
	cause = "Invalid workplaceId";
	httpStatus = 400;
}

registerException(NoWorkplaceException);



export default NoWorkplaceException;
