import { SubRouter } from "../../jrouter/jrouter.js";
//import { getSessionId } from "../common/sessionId.js";



const my = (courseManager,sessionManager) => {
	const router = new SubRouter();

	router.useGetMethod("/",null, async(request,response) => {
		//const sessionId = getSessionId(request);
		if(!sessionId) return response.status(401).send("No authentication token in request");
		const { user,error:userError } = await sessionManager.getSessionUser(sessionId);
		if(userError) return response.status(401).send(userError);
		const myCourses = await courseManager.getUserCourseList(user);
		response.send(myCourses);
	});

	return router;
}



export default my;
