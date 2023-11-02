import JHttp from "./jHttp.js";
import type { requestOptions } from "./jHttp.js";
import type JHttpClient from "./jHttpClient.js";



class JHttpAux extends JHttp {
	_basePath:string;
	_jHttpClient:JHttpClient;

	constructor(jHttpClient:JHttpClient,basePath:string) {
		super();
		this._jHttpClient = jHttpClient;
		this._basePath = basePath;
	};

	init = async() => {
	};

	get = async(path:string,options:requestOptions={}) => {
		return this._jHttpClient.get(`/${this._basePath}/${path}`,options);
	};

	post = async(path:string,payload:any,options:requestOptions={}) => {
		return this._jHttpClient.post(`/${this._basePath}/${path}`,options);
	};

	put = async(path:string,payload:any,options:requestOptions={}) => {
		return this._jHttpClient.put(`/${this._basePath}/${path}`,options);
	};

	delete = async(path:string,options:requestOptions={}) => {
		return this._jHttpClient.delete(`/${this._basePath}/${path}`,options);
	};
};



export default JHttpAux;



/*

*/