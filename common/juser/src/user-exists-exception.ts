import Exception from "jexception";



class UserExistsException extends Exception {
	static typeId = "5b581eed-639d-46ef-9ced-ba228818fc39";
	cause = "User with that email already exists";
	httpCode = 400;
};



export default UserExistsException;
