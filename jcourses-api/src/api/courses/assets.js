import { SubRouter } from "../../jrouter/jrouter.js";
//import { getCurrentUser } from "../common/sessionId.js";
import JJoi from "jjoi";



const validationSchema = JJoi.object().required().keys({
	params : JJoi.object().required().keys({
		courseId : JJoi.string().required(),
		assetName : JJoi.string().required(),
	}).options({ allowUnknown:false }),
}).options({ allowUnknown:true });

const assets = (courseManager) => {
	const router = new SubRouter();

	router.useGetMethod("/:courseId/:assetName",validationSchema,async(request,response) => {
		//const user = await getCurrentUser(sessionManager,request);
		const { courseId,assetName } = request.params;
		//const { user,error:userError } = await sessionManager.getSessionUser(sessionId);
		const { assetFilePath,error:assetError } = await courseManager.getCourseAsset(null,courseId,assetName);
		//
		if(assetError) {
			//if(userError) return response.status(401).send(userError);
			return response.status(500).send(assetError);
		}
		response.sendFile(assetFilePath);
	});

	return router;
};



export default assets;
