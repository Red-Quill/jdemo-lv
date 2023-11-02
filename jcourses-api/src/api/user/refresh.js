import { SubRouter } from "../../jrouter/jrouter.js";
import { getSessionUser } from "../common/sessionId.js";



const refresh = (sessionManager) => {
	const router = new SubRouter();

	router.useGetMethod("/",null,async(request,response) => {
		const user = await getSessionUser(sessionManager,request);

		//Do the refresh

		const userObject = user._object;
		response.send(userObject);
	});
	
	return router;
};



export default refresh;
