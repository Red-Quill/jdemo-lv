import InvalidRecaptchaException from "./invalid-recaptcha-exception";
import JHttpClient from "jhttp-client";



type VerifierConstructor = {
	httpClient?:JHttpClient;
	path?:string;
	secret:string;
};

class Verifier {
	_httpClient:JHttpClient;
	_secret:string;
	
	constructor({ httpClient,secret }:VerifierConstructor) {
		this._httpClient = httpClient || new JHttpClient({ url:"https://www.google.com",path:"/recaptcha/api/siteverify" });
		this._secret = secret;
	}

	assert = async(reCaptcha:string) => {
		const params = {
			secret : this._secret,
			response : reCaptcha,
		};
		// @ts-ignore
		const response = await this._httpClient.post(this._path,null,{ params });
		if(!response.data.success) throw new InvalidRecaptchaException("possibly expired, refresh and try again");
	};
}



export default Verifier;

