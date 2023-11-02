import type { AxiosResponse,AxiosRequestConfig } from "axios";
import { JSchema } from "jutils";


type requestOptions = AxiosRequestConfig & {
	expectedResponseStatusCodes?:number[];
	validateResponse?:JSchema;
}

//type HttpReturn = [AxiosResponse|null,AxiosError|null];

const notImplementedErr = () => {
	throw new Error("Not implemented");
}

class JHttp {

	get = async(path:string,options?:requestOptions):Promise<AxiosResponse> => notImplementedErr();

	post = async(path:string,payload:any,options?:requestOptions):Promise<AxiosResponse> => notImplementedErr();

	put = async(path:string,payload:any,options?:requestOptions):Promise<AxiosResponse> => notImplementedErr();

	delete = async(path:string,options?:requestOptions):Promise<AxiosResponse> => notImplementedErr();
};



export default JHttp;
export type { requestOptions }
