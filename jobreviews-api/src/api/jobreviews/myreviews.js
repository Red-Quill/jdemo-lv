import { SubRouter } from "../../jrouter/jrouter.js";



const review = (jobReviewsApi) => {
	const router = new SubRouter();

	/*
	router.usePostMethod("/",null,async(request,response) => {
		const { body } = await jobReviewsApi.review_POST(request);
		response.send(body);
	});
	*/

	router.useGetMethod("/",null,async(request,response) => {
		const { body } = await jobReviewsApi.myreviews_GET(request);
		response.send(body);
	});

	return router;
};



export default review;


/*


const validationSchema = JJoi.object().required().keys({
	body : JJoi.object().required().keys({
		name : JJoi.string().required(),
		email : JJoi.string().required(),
		password : JJoi.string().required(),
		reCaptcha : JJoi.string().required(),
	}).options({ allowUnknown:false }),
}).options({ allowUnknown:true });

const register = (userManager,authenticator,emailer) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",validationSchema,async(request,response) => {
		const { name,email,password,reCaptcha } = request.body;
		await authenticator.assertReCaptcha(reCaptcha);
		const passwordId = await authenticator.addPassword(password);
		const user = await userManager.addUser(name,email,passwordId);
		emailer.sendActivationLink(email,"localhost:3000",user._id); // no need to await
		response.send(true);
	});
	
	return router;
};


	try {
		// Sending secret key and response token to Google Recaptcha API for authentication.
		const response = await axios.post(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
		);

		// Check response status and send back to the client-side
		if (response.data.success) {
		res.send("Human 👨 👩");
		} else {
		res.send("Robot 🤖");
		}
	} catch (error) {
		// Handle any errors that occur during the reCAPTCHA verification process
		console.error(error);
		res.status(500).send("Error verifying reCAPTCHA");
	}
*/
