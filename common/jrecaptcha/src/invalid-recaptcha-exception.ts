import Exception from "jexception";



class InvalidRecaptchaException extends Exception {
	static typeId = "fdd7e3cb-d6c2-49d8-a849-71dcfc333974";
	cause = "Invalid Recaptcha";
	httpStatus = 400;
}



export default InvalidRecaptchaException;
