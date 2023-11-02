import { SubRouter } from "../../jrouter/jrouter.js";



const current = (userApi) => {
	const router = new SubRouter();

	router.useGetMethod("/",null,async(request,response) => {
		const { _object:userObject } = await userApi.getCurrentUser(request);
		response.send(userObject);
	});
	
	return router;
};



export default current;
