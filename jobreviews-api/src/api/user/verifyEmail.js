import { SubRouter } from "../../jrouter/jrouter.js";



// when users changes email address
const verifyEmail = (userApi) => {
	const router = new SubRouter();

	router.usePostMethod("/",userApi.verifyemail_validate,async(request,response) => {
		const { body } = await userApi.verifyemail_POST(request);
		response.send(body);
	});
	
	return router;
};



export default verifyEmail;
