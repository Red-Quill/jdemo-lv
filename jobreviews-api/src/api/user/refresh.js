import { SubRouter } from "../../jrouter/jrouter.js";



const current = (userApi) => {
	const router = new SubRouter();

	router.useGetMethod("/",null,async(request,response) => {
		const { body,cookies } = await userApi.refresh_GET(request);
		const { sessionId:{ value:sessionId },secureId:{ value:secureId,expires } } = cookies;
		response.cookie("sessionId",sessionId,{ secure:true,expires });
		response.cookie("secureId",secureId,{ secure:true,httpOnly:true,expires });
		response.send(body);
	});
	
	return router;
};



export default current;
