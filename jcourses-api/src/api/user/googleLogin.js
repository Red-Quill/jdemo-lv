import { SubRouter } from "../../jrouter/jrouter.js";



const googlelogin = (userApi) => {
	const router = new SubRouter();

	router.usePostMethod("/",userApi.googlelogin_validate,async(request,response) => {
		const { body,cookies } = await userApi.googlelogin_POST(request);
		const { sessionId:{ value:sessionId },secureId:{ value:secureId,expires } } = cookies;
		response.cookie("sessionId",sessionId,{ secure:true,expires });
		response.cookie("secureId",secureId,{ secure:true,httpOnly:true,expires });
		response.send(body);
	});
	
	return router;
};



export default googlelogin;
