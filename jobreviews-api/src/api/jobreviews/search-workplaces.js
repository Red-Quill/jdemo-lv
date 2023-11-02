import { SubRouter } from "../../jrouter/jrouter.js";



const searchWorkplaces = (jobReviewsApi) => {
	const router = new SubRouter();
		
	router.useGetMethod("/",null,async(request,response) => {
		console.log("search/workplaces");
		const { body } = await jobReviewsApi.searchWorkplaces_GET(request);
		console.log("JEEZZZ")
		console.log(body);
		response.set("Cache-Control","no-cache, no-store, must-revalidate");
		response.send(body);
	});
	
	return router;
};



export default searchWorkplaces;
