import { SubRouter } from "../../jrouter/jrouter.js";



const resetPassword = (userApi) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",userApi.resetpassword_validate,async(request,response) => {
		await userApi.resetpassword_POST(request);
		response.send(true);
	});
	
	return router;
};



export default resetPassword;


/*

*/
