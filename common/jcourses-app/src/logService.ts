import type HttpService from "jhttp-client";



class LogService {
	_httpService:HttpService;

	constructor(logUncaught:boolean) {
		if(logUncaught) {
			window.addEventListener('error',({ type,message }) => this.logErrorString(`${type}:${message}`));
			window.addEventListener('unhandledrejection',({ reason }) => this.logErrorString(reason));
		}
	}

	init = async(httpService:HttpService) => {
		this._httpService = httpService;
	};

	logError = async(error:Error) => {
		console.log(`got an errer`)
	};

	logErrorString = async(errorString:string) => {
		console.log(`got an error ${errorString}`);
	};
}



export default LogService;
