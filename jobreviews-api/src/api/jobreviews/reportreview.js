import { SubRouter } from "../../jrouter/jrouter.js";



const reportReview = (jobReviewsApi) => {
	const router = new SubRouter();

	router.usePostMethod("/",null,async(request,response) => {
		await jobReviewsApi.reportreview_POST(request);
		response.send(true);
	});
	
	return router;
};



export default reportReview;


/*

*/
