import JJoi from "jjoi";
import JobReviewsManager from "./job-reviews-manager";
import { JReport, Review,Workplace, WorkplaceStatistics } from "jobwarnings-shared";
import type { UserApi } from "juser-service";



type Request = {
	body:any;
	cookies?:any;
	query?:any;
	params?:any;
	get:Function;
};

type Response = {
	body:any;
	cookies?:any;
};

class JobReviewsApi {
	_jobReviewsManager:JobReviewsManager;
	_userApi:UserApi;

	constructor() {
		this._jobReviewsManager = new JobReviewsManager();
	}

	init = async(databaseManager:any,userApi:UserApi) => {
		console.log("BEGIN: Initializing JobReviewsApi");
		this._userApi = userApi;
		await this._jobReviewsManager.init(databaseManager);
		console.log("END: JobReviewsApi initalized");
	};

	// ---

	reviews_validate:any = JJoi.object().required().keys({
		query : JJoi.object().required().keys({
			category : JJoi.string(),
			workplace : JJoi.string().allow(""),
			city : JJoi.string().allow(""),
			first : JJoi.string().required(), // TODO: number
			last : JJoi.string().required(), // TODO: number
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });

	reviews_GET = async(request:Request) => {
		const { category,workplace,city,first,last } = request.query;
		const query = {
			category,
			workplace,
			city,
			first : Number(first),
			last : Number(last),
		};
		//const result = await this._jobReviewsManager.getReviews(query);
		//return { body:result };
	};

	// ---

	// reviews/search - return uuids of results, then frontend will fetch the results that are likely cached

	search_validate = this.reviews_validate;

	searchReviews_GET = async(request:Request) => {
		console.log("--> API search/reviews GET");
		const { workplaceNameLowerCase="",localities=[],sortBy,first,last } = request.query;
		const query = {
			workplaceNameLowerCase,
			localities,
			sortBy,
			first : Number(first),
			last : Number(last),
		};
		const result = await this._jobReviewsManager.searchReviews(query);
		console.log("<-- API search/reviews GET");
		return { body:result };
	};

	searchWorkplaceReviews_GET = async(request:Request) => {
		console.log("GEEEEET",request.query);
		const { _id:workplaceId } = request.params;
		const { sortBy,first,last } = request.query;
		const query = {
			workplaceId,
			sortBy,
			first : Number(first),
			last : Number(last),
		};
		const result = await this._jobReviewsManager.searchWorkplaceReviews(query);
		console.log("GOOOOT");
		return { body:result };
	};

	searchWorkplaces_GET = async(request:Request) => {
		console.log("GEEEEET",request.query);
		const { workplaceNameLowerCase="",localities=[],sortBy,first,last } = request.query;
		const query = {
			nameLowerCase : workplaceNameLowerCase,
			localities,
			sortBy,
			first : Number(first),
			last : Number(last),
		};
		const result = await this._jobReviewsManager.searchWorkplaces(query);
		console.log("GOOOOT");
		return { body:result };
	};

	//workplace_POST_validate = this.review_validate;

	/*
	workplace_POST = async(request:Request) => {
		console.log("POOOOST");
		const user = await this._userApi.getSessionUser(request); // throws if no session
		const workplace = Workplace.fromObject(request.body);
		console.log(workplace._object);
		console.log(workplace);
		const result = await this._jobReviewsManager.newWorkplace(workplace,user);
		// TODO: set cache controls
		console.log("POOOOSTED");
		return { body:workplace._object };
	};
	*/

	workplace_GET = async(request:Request) => {
		console.log("GEEEEETW");
		const { _id } = request.params;
		const workplaceObject = await this._jobReviewsManager.getWorkplaceObject(_id);
		// TODO: set cache controls
		console.log("GOOOOTW");
		console.log(workplaceObject);
		return { body:workplaceObject };
	};

	workplaceStatistics_GET = async(request:Request) => {
		console.log("GEEEEETW");
		const { _id } = request.params;
		const workplaceStatisticsObject = await this._jobReviewsManager.getWorkplaceStatisticsObject(_id);
		// TODO: set cache controls
		console.log("GOOOOTW");
		console.log(workplaceStatisticsObject);
		return { body:workplaceStatisticsObject };
	};

	/*
	// reviews/review/:id

	review_validate:any = JJoi.object().required().keys({
		params : JJoi.object().required().keys({
			_id : JJoi.string().guid(),
		}).options({ allowUnknown:false }),
	}).options({ allowUnknown:true });



	// reviews/workplace/:id

	workplace_validate = this.review_validate;



	*/


	// reviews/submit

	review_GET = async(request:Request) => {
		console.log("GEEEEET");
		const { _id } = request.params;
		const reviewObject = await this._jobReviewsManager.getReviewObject(_id);
		// TODO: set cache controls
		console.log("GOOOOT");
		console.log(reviewObject);
		return { body:reviewObject };
	};

	review_DELETE = async(request:Request) => {
		console.log("GEEEEET");
		const { _id } = request.params;
		const user = await this._userApi.getSessionUser(request); // throws if no session
		if(!user.admin) new Error("SHIIIIT MAAAN");
		await this._jobReviewsManager.deleteReview(_id,user);
		// TODO: set cache controls
		console.log("GOOOOT");
		return { body:true };
	};

	myreview_DELETE = async(request:Request) => {
		console.log("GEEEEET");
		const { _id } = request.params;
		const user = await this._userApi.getSessionUser(request); // throws if no session
		const myReviewIds = await this._jobReviewsManager.getMyReviews(user);
		if(!myReviewIds.includes(_id)) throw new Error("SHIIIIT MAAAN");
		await this._jobReviewsManager.deleteMyReview(_id,user);
		// TODO: set cache controls
		console.log("GOOOOT");
		return { body:true };
	};

	myreviews_GET = async(request:Request) => {
		console.log("--> JobReviewsApi myreviews_GET");
		const user = await this._userApi.getSessionUser(request); // throws if no session
		const reviewIds = await this._jobReviewsManager.getMyReviews(user);
		console.log("<-- JobReviewsApi myreviews_GET");
		return { body:reviewIds };
	};

	addreview_POST = async(request:Request) => {
		console.log("--> JobReviewsApi addreview_POST");
		const { reviewObject,reCaptcha } = request.body;
		const user = await this._userApi.getSessionUser(request); // throws if no session
		await this._userApi.assertReCaptcha(reCaptcha); // throws if invalid
		//this._jobReviewsManager.newReviewAssertRateLimit(user);
		const review = new Review(reviewObject);
		console.log("saving review to database")
		await this._jobReviewsManager.addReview(review,user);
		console.log("<-- JobReviewsApi addreview_POST");
		return { body:review._object };
	};

	newreview_POST = async(request:Request) => {
		console.log("--> JobReviewsApi newreview_POST");
		const { workplaceObject,reviewObject,workplaceStatisticsObject,reCaptcha } = request.body;
		const user = await this._userApi.getSessionUser(request); // throws if no session
		await this._userApi.assertReCaptcha(reCaptcha); // throws if invalid
		//await this._jobReviewsManager.newReviewAssertRateLimit(user);
		const review = new Review(reviewObject);
		review.workplace = new Workplace(workplaceObject);
		review.workplace.workplaceStatistics = new WorkplaceStatistics(workplaceStatisticsObject);
		console.log("saving review to database")
		await this._jobReviewsManager.newReview(review,user);
		console.log("<-- JobReviewsApi newreview_POST");
		return { body:review._object };
	};
	
	// ---

	reportreview_POST = async(request:Request) => {
		console.log("--> JobReviewsApi reportreview");
		const { jReportObject,reCaptcha } = request.body;
		const user = await this._userApi.getSessionUser(request); // throws if no session
		await this._userApi.assertReCaptcha(reCaptcha); // throws if invalid
		const jReport = new JReport(jReportObject);
		await this._jobReviewsManager.reportReview(jReport,user);
		console.log("<-- JobReviewsApi reportreview");
		return { body:true };
	};

	// only for moderators
	restorereview_PUT = async(request:Request) => {
		const user = await this._userApi.getSessionUser(request); // throws if no session
		if(!user.admin) throw new Error("User must be a moderator to restore a review!");
		const { reviewId } = request.body;
		await this._jobReviewsManager.restoreReview(reviewId,"");
		return { body:true };
	};
}



export default JobReviewsApi;

/*

*/