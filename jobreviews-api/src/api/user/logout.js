import { SubRouter } from "../../jrouter/jrouter.js";



const logout = (userApi) => {
	const router = new SubRouter();

	router.usePostMethod("/",null,async(request,response) => {
		await userApi._clearUserSession(request,{});
		response.clearCookie("sessionId");
		response.clearCookie("secureId");
		response.send(true);
	});

	return router;
};



export default logout;
