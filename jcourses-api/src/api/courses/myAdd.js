import { SubRouter } from "../../jrouter/jrouter.js";
//import { getSessionId } from "../common/sessionId.js";



const myAdd = (courseManager,sessionManager) => {
	const router = new SubRouter();

	router.usePutMethod("/",null,async(request,response) => {
		//const sessionId = getSessionId(request);
		if(!sessionId) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionId);
		if(userError) return response.status(401).send(userError);
		const { error:addError } = await courseManager.addCourseToUser(course,user);
		if(addError) return response.status(500).send(error);
		response.send(true);
	});

	return router;
};



export default myAdd;
