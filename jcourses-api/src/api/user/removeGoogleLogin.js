import { SubRouter } from "../../jrouter/jrouter.js";



/* add google login to existing user */
const removeGoogleLogin = (userApi) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",null,async(request,response) => {
		const { body } = await userApi.removegooglelogin_POST(request);
		response.send(body);
	});
	
	return router;
};



export default removeGoogleLogin;
