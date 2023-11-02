import { SubRouter } from "../../jrouter/jrouter.js";



const changeEmail = (userApi) => {
	const router = new SubRouter();

	router.usePostMethod("/",userApi.changeemail_validate,async(request,response) => {
		await userApi.changeemail_POST(request);
		response.send(true);
	});
	
	return router;
};



export default changeEmail;
