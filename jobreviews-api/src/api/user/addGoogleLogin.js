import { SubRouter } from "../../jrouter/jrouter.js";



/* add google login to existing user */
const addGoogleLogin = (userApi) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",userApi.addgooglelogin_validate,async(request,response) => {
		const { body } = await userApi.addgooglelogin_POST(request);
		response.send(body);
	});
	
	return router;
};



export default addGoogleLogin;
