import { SubRouter } from "../../jrouter/jrouter.js";



const activate = (userApi) => {
	const router = new SubRouter();

	router.usePostMethod("/",userApi.activate_validate,async(request,response) => {
		await userApi.activate_POST(request);
		response.send(true);
	});
	
	return router;
};



export default activate;

/*
const userObjectSchema = JJoi.object().required().keys({
	_id : JJoi.string().guid().required(),
	name : userNameSchema,
	email : userEmailSchema,
	passwordId : JJoi.string().allow(""),
	googleId : JJoi.string().allow(""),
	admin : JJoi.boolean(),
}).options({ allowUnknown:true });


*/