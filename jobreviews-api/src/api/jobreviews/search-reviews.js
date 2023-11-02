import { SubRouter } from "../../jrouter/jrouter.js";



const searchRewievs = (jobReviewsApi) => {
	const router = new SubRouter();
		
	router.useGetMethod("/",null,async(request,response) => {
		console.log("--> search/reviews");
		const { body } = await jobReviewsApi.searchReviews_GET(request);
		console.log(body);
		response.set("Cache-Control","no-cache, no-store, must-revalidate");
		response.send(body);
		console.log("<-- search/reviews");
	});
	
	return router;
};



export default searchRewievs;
