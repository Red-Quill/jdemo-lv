import { SubRouter } from "../../jrouter/jrouter.js";
import { getIfModifiedSince } from "../common/modificationTimestamps.js";



const catalog = (courseManager) => {
	const router = new SubRouter();
	let courseObjectsJson = "";
	let lastUpdated = 0;
	let header = {
		"Last-Modified" : "",
		"Cache-Control" : "max-age=1800, stale-while-revalidate=86400, stale-if-error=86400",
	};

	const updateCache = async() => {
		const coursesLastUpdated = courseManager.coursesLastUpdated();
		if(coursesLastUpdated > lastUpdated) {
			const courses = await courseManager.getCourses();
			const courseObjects = courses.map((course) => course._object);
			courseObjectsJson = JSON.stringify(courseObjects);
			lastUpdated = coursesLastUpdated + 1025; // a little extra to make sure all comparisons work as expected
			header = {
				"Last-Modified" : (new Date(lastUpdated)).toUTCString(),
				"Cache-Control" : "max-age=1800, stale-while-revalidate=86400, stale-if-error=86400",
			};
		}	
	};

	updateCache();
	setInterval(updateCache,600_000);

	router.useGetMethod("/",null, async(request,response) => {
		const timeStamp = getIfModifiedSince(request);
		if(timeStamp >= lastUpdated) return response.status(304).send();
		response.header(header).send(courseObjectsJson);
	});
	
	return router;
};



export default catalog;
