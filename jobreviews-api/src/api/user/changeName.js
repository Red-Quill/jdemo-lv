import { SubRouter } from "../../jrouter/jrouter.js";



const changeName = (userApi) => {
	const router = new SubRouter();

	router.usePostMethod("/",userApi.changename_validate,async(request,response) => {
		const { body } = await userApi.changename_POST(request);	
		response.send(body);
	});
	
	return router;
};



export default changeName;
