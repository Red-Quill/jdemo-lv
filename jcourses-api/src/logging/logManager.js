import winston from "winston";



class LogManager {
	_winstonLogger;

	constructor({ logFilesPath }) {
		this._winstonLogger = winston.createLogger({
			level: 'warn',
			format: winston.format.simple(),
			transports : [
				new winston.transports.Console(),
				new winston.transports.File({ filename:`${logFilesPath}/error.log` }),
			],
		});
	};
	
	logError = ({ cause,message,stack }) => {
		console.log(stack);
		this._winstonLogger.error(`${cause || ""} - ${message || ""}`);
	};

	errorMessage = (message) => {
		this._winstonLogger.error(message);
	};

	warningMessage = (message) => {
		this._winstonLogger.warning(message);
	};
};



export default LogManager;
