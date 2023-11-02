//import Exception from "jexception";

const errorHandler = (logManager) => {
	
	const errorHandler = async(request,response,error) => {
		logManager.logError(error);
		const { message,httpStatus,cause,typeId } = error;
		response.status(httpStatus || 500).send({
			message : `${cause || "Something went wrong on the server side"}${message ? `: ${message}`: ""}`,
			...(typeId ? { typeId } : {}),
		});
		//throw error;
	};

	return errorHandler;
};



export default errorHandler;
