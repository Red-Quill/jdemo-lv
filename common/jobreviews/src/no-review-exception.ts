import Exception,{ registerException } from "jexception";



class NoReviewException extends Exception {
	static typeId = "41121a06-8857-45e9-a4ab-2800a95957c2";
	cause = "Invalid reviewId";
	httpStatus = 400;
}

registerException(NoReviewException);



export default NoReviewException;
