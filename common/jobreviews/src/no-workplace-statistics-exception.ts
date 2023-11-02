import Exception,{ registerException } from "jexception";



class NoWorkplaceStatisticsException extends Exception {
	static typeId = "6d43553d-4326-4634-8eae-eab2528f9d0d";
	cause = "Invalid workplaceStatisticsId";
	httpStatus = 400;
}

registerException(NoWorkplaceStatisticsException);



export default NoWorkplaceStatisticsException;
