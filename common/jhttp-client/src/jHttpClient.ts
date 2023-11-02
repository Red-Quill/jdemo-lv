import axios,{ AxiosError } from "axios";
import type { Axios,AxiosResponse } from "axios";
import JHttp from "./jHttp.js";
import type { requestOptions } from "./jHttp.js";
import { getExceptionNoError } from "jexception";
import { JJoi } from "jjoi";



const location = typeof window === "object" ? window.location : { hostname:"",port:"",protocol:"" };

type constructorOptions = {
	url?:string;
	port?:number;
	path?:string;
	cookieJar?:any;
};

class JHttpClient extends JHttp {
	_baseURL:string;
	_axios:Axios;

	constructor({ url,port,path,cookieJar }:constructorOptions={}) {
		super();
		const { hostname,protocol,port:_port } = location;
		const hostPart = `${protocol}//${hostname}`;
		this._baseURL = `${url ? url : hostPart}:${port ? port : _port}${path ? path : "/"}`;
		// @ts-ignore
		this._axios = axios.create({ baseURL:this._baseURL,jar:cookieJar });
	};

	init = async() => {
	};

	get = async(
		path:string,
		{ expectedResponseStatusCodes=[ 200,203,204 ],validateResponse,...requestOptions }:requestOptions={}
	):Promise<AxiosResponse> => {
		const _response = await this._get(path,requestOptions);
		this._checkResponse(_response,expectedResponseStatusCodes);
		//const response = validateResponse ? JJoi.assert(_response,validateResponse) : _response;
		return _response;
	};

	getraw = async(
		path:string,
		{ expectedResponseStatusCodes=[ 200,203,204 ],...requestOptions }:requestOptions={}
	):Promise<AxiosResponse> => {
		const response = await this._axios.get(path,{ ...requestOptions,transformResponse:(_) => _ });
		this._checkResponse(response,expectedResponseStatusCodes);
		return response;
	};

	_get = async(
		path:string,
		requestOptions:requestOptions,
	):Promise<AxiosResponse> => {
		try {
			return await this._axios.get(path,requestOptions);
		} catch(error:any) {
			this._processAxiosError(error);
		}
	};

	post = async(
		path:string,
		payload?:any,
		{ expectedResponseStatusCodes=[ 200,201,202 ],...requestOptions }:requestOptions={}
	):Promise<AxiosResponse> => {
		const response = await this._post(path,payload,requestOptions);
		this._checkResponse(response,expectedResponseStatusCodes);
		return response;
	};

	_post = async(
		path:string,
		payload:any,
		requestOptions:requestOptions,
	):Promise<AxiosResponse> => {
		try {
			return await this._axios.post(path,payload,requestOptions);
		} catch(error:any) {
			this._processAxiosError(error);
		}
	};

	put = async(
		path:string,
		payload?:any,
		{ headers,responseType,expectedResponseStatusCodes=[ 200,201,202 ] }:requestOptions={}
	):Promise<AxiosResponse> => {
		const response = await this._axios.put(path,payload,{ headers,responseType });
		this._checkResponse(response,expectedResponseStatusCodes);
		return response;
	};

	_put = async(
		path:string,
		payload:any,
		requestOptions:requestOptions,
	):Promise<AxiosResponse> => {
		try {
			return await this._axios.put(path,payload,requestOptions);
		} catch(error:any) {
			this._processAxiosError(error);
		}
	};

	delete = async(
		path:string,
		{ expectedResponseStatusCodes=[ 200,202,204 ],...requestOptions }:requestOptions={}
	):Promise<AxiosResponse> => {
		const response = await this._delete(path,requestOptions);
		this._checkResponse(response,expectedResponseStatusCodes);
		return response;
	};

	_delete = async(
		path:string,
		requestOptions:requestOptions,
	):Promise<AxiosResponse> => {
		try {
			return await this._axios.delete(path,requestOptions);
		} catch(error:any) {
			this._processAxiosError(error);
		}
	};

	_checkResponse = (response:AxiosResponse,expectedResponseStatusCodes:number[]) => {
		if(expectedResponseStatusCodes.includes(response.status)) return;
		throw new AxiosError(`Unexpected response status`,"",null,response.request,response)
	};

	_processAxiosError = (error:any) => {
		console.log(error); // TMP
		const { typeId,info } = error.response.data;
		if(typeId) {
			const _Exception = getExceptionNoError(typeId);
			if(_Exception) {
				throw new _Exception(info);
			}
		}
		throw error;
	};
};



export default JHttpClient;



/*

axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  });

*/