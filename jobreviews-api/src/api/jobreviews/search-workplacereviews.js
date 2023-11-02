import { SubRouter } from "../../jrouter/jrouter.js";



const searchWorkplacereviews = (jobReviewsApi) => {
	const router = new SubRouter();
		
	router.useGetMethod("/:_id",null,async(request,response) => {
		console.log("JEEXXX");
		const { body } = await jobReviewsApi.searchWorkplaceReviews_GET(request);
		console.log("JEEZZZXXX")
		console.log(body);
		response.set("Cache-Control","no-cache, no-store, must-revalidate");
		response.send(body);
	});
	
	return router;
};



export default searchWorkplacereviews;
