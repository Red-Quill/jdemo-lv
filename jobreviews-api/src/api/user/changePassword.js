import { SubRouter } from "../../jrouter/jrouter.js";



const changePassword = (userApi) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",userApi.changepassword_validate,async(request,response) => {
		const { body } = await userApi.changepassword_POST(request);
		response.send(body);
	});
	
	return router;
};



export default changePassword;
