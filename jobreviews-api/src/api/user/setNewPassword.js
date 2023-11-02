import { SubRouter } from "../../jrouter/jrouter.js";



const setNewPassword = (userApi) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",userApi.setnewpassword_validate,async(request,response) => {
		await userApi.setnewpassword_POST(request);
		response.send(true);
	});
	
	return router;
};



export default setNewPassword;
