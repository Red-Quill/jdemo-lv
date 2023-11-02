import type { JHttp } from "jhttp-client";
import { JReport, Locality,Review,Workplace,WorkplaceStatistics } from "jobwarnings-shared";
import type { GoogleClient } from "./google-client";
import { InvalidRecaptchaException } from "jrecaptcha";
import { IdBasedLRUCache, jdebug } from "jutils";
import type { J18Next } from "j18next";



type reviewData = {
	score:number;
	description:string;
}

type newReview = reviewData & {
	locality:any;
	workplaceName:string;
	reCaptcha:string;
}

type addReview = reviewData & {
	workplace:Workplace;
	reCaptcha:string;
}

class JobReviews {
	_http:JHttp;
	_googleClient:GoogleClient;
	_localization:J18Next;
	_reCaptchaId:string;
	_workplaceCache:IdBasedLRUCache<Workplace>;
	_reviewCache:IdBasedLRUCache<Review>;
	_localityCache:IdBasedLRUCache<Locality>;
	cognito:any; // TMP

	constructor(reCaptchaId:string,{ cognito }:any={}) {
		this._localityCache = new IdBasedLRUCache(200,15);
		this._workplaceCache = new IdBasedLRUCache(300,15);
		this._reviewCache = new IdBasedLRUCache(900,50);
		this._reCaptchaId = reCaptchaId;
		this.cognito = cognito; //TMP
	}

	init = async(http:JHttp,googleClient:GoogleClient,localization:J18Next) => {
		this._http = http;
		this._googleClient = googleClient;
		this._localization = localization;
		this._localization.onLanguageChanged((_) => this.clearCache());
	};

	get reCaptchaId() {return this._reCaptchaId;}

	clearCache = () => {
		this._reviewCache.clear();
		this._workplaceCache.clear();
		this._localityCache.clear();
	};

	// new review & new workplace
	newReview = async({ workplaceName,locality,score,description,reCaptcha }:newReview) => {
		console.log(workplaceName,score,description);
		console.log(locality)
		if(!reCaptcha) throw new InvalidRecaptchaException("Please, verify that you are not a robot");
		const { workplace,workplaceObject,workplaceStatistics:{ workplaceStatisticsObject } } = Workplace.new({ name:workplaceName,locality,initialScore:score });
		const { reviewObject } = Review.new({ workplace,score,description });
		await this._http.post("/api/jobreviews/newreview",{ reviewObject,workplaceObject,workplaceStatisticsObject,reCaptcha });
	};

	// add review to existing workplace
	addReview = async({ workplace,score,description,reCaptcha }:addReview) => {
		if(!reCaptcha) throw new InvalidRecaptchaException("Please, verify that you are not a robot");
		const { reviewObject } = Review.new({ workplace,score,description });
		await this._http.post("/api/jobreviews/addreview",{ reviewObject,reCaptcha });
	};

	deleteWorkplace = async({ workplaceId }:Workplace) => {
		await this._http.delete(`/api/jobreviews/workplace/${workplaceId}`);
	};

	deleteReview = async({ reviewId }:Review) => {
		await this._http.delete(`/api/jobreviews/review/${reviewId}`);
	};

	deleteMyReview = async({ reviewId }:Review) => {
		await this._http.delete(`/api/jobreviews/myreview/${reviewId}`);
	};

	reviewSortOptions:{ [key:string]:[ string,string ] } = {
		newest : [ "createdAt","descending" ],
		oldest : [ "createdAt","ascending" ],
		best : [ "score","descending" ],
		worst : [ "score","ascending" ],
	};

	workplaceSortOptions:{ [key:string]:[ string,string ] } = {
		newest : [ "createdAt","descending" ],
		oldest : [ "createdAt","ascending" ],
		best : [ "scoreAverage","descending" ],
		worst : [ "scoreAverage","ascending" ],
	}

	searchWorkplaces = async({ localities=[],workplaceNameLowerCase="",sortBy="newest",first=0,last=10 }) => {
		const params = {
			workplaceNameLowerCase,
			localities : localities.map((locality:any) => locality.place_id),
			sortBy : this.workplaceSortOptions[sortBy],
			first,
			last,
		};
		const { data:{ workplaceIds,total } } = await this._http.get("/api/jobreviews/search/workplaces",{ params });
		const _workplaces = workplaceIds.map((workplaceId:string) => this.getWorkplace(workplaceId));
		const workplaces = await Promise.all(_workplaces);
		return { workplaces,total };
	};

	searchReviews = async({ localities=[],workplaceNameLowerCase="",sortBy="newest",first=0,last=10 }:any={}) => {
		console.log("getting reviews",workplaceNameLowerCase,localities,first,last)
		const params = {
			workplaceNameLowerCase,
			localities : localities.map((locality:any) => locality.place_id),
			sortBy : this.reviewSortOptions[sortBy],
			first,
			last,
		};
		console.log("Fetching review ids")
		const { data:{ reviewIds,total }} = await this._http.get("/api/jobreviews/search/reviews",{ params });
		console.log("Got results!!!!",reviewIds)
		const _reviews = reviewIds.map((reviewId:string) => this.getReview(reviewId));
		console.log("Fetching reviews")
		const reviews = await Promise.all(_reviews);
		console.log(reviews)
		return { reviews,total };
	};

	// for workplace page (that shows info and reviews of specific workplace)
	searchWorkplaceReviews = async({ workplace,sortBy="newest",first=0,last=10 }:any={}) => {
		console.log("getting reviews",first,last)
		const params = {
			sortBy : this.reviewSortOptions[sortBy],
			first,
			last,
		};
		console.log("Fetching review ids")
		const { data:{ reviewIds,total }} = await this._http.get(`/api/jobreviews/search/workplacereviews/${workplace._id}`,{ params });
		const _reviews = reviewIds.map((reviewId:string) => this.getReview(reviewId));
		console.log("Fetching reviews")
		const reviews = await Promise.all(_reviews);
		console.log(reviews)
		return { reviews,total };
	};

	_getReview = async(reviewId:string) => {
		try {
			return await this.getReview(reviewId);
		} catch(exception:any) {
			return null;
		};
	};

	getReview = async(reviewId:string) => {
		jdebug.message("--> jobreviews getReview")
		const cached = this._reviewCache.retrieve(reviewId);
		if(cached) return cached;
		const { data }:any = await this._http.get(`/api/jobreviews/review/${reviewId}`);
		jdebug.message("--- got review");
		jdebug.message(data);
		const review = new Review(data);
		const workplace = await this.getWorkplace(data.workplaceId);
		review.workplace = workplace;
		this._reviewCache.cache(review);
		jdebug.message("<-- jobreviews getReview")
		return review;
	};

	/*
	getMyReview = async(jobReviewId:string) => {
		try {
			const cached = this._cache.get(jobReviewId);
			if(cached) return cached;
			console.log("Getting REVIEWWWWWW");
			const { data }:any = await this._http.get(`/api/jobreviews/review/${jobReviewId}`);
			console.log(data);
			const workplace = await this.getWorkplace(data.workplaceId);
			const review = Review.fromObject(data);
			review.workplace = workplace;
			this._cache.set(jobReviewId,review);
			return review;
		} catch(exception:any) {
			let returnValue = null;
			matchExceptions(exception,
				NoReviewException, () => {
					console.log("LOOOOOL")
					returnValue = reviewDeleted},
			);
			return returnValue;
		}
	};
	*/

	getWorkplace = async(workplaceId:string) => {
		const cached = this._workplaceCache.retrieve(workplaceId);
		if(cached) return cached;
		console.log("Getting WOOOOrk")
		const { data:workplaceData }:any = await this._http.get(`/api/jobreviews/workplace/${workplaceId}`);
		const { data:workplaceStatisticsData }:any = await this._http.get(`/api/jobreviews/workplacestatistics/${workplaceData.workplaceStatisticsId}`);
		/* obsolete
		const locality = this.getLocality(workplaceData.place_id);
		const details = await this._googleClient.getPlaceDetails({
			placeId : workplaceData.place_id,
			fields : [ "name" ],
			language : "fi",
		});
		*/
		const workplace = new Workplace(workplaceData);
		workplace.locality = await this.getLocality(workplaceData.place_id);;
		workplace.workplaceStatistics = new WorkplaceStatistics(workplaceStatisticsData);
		this._workplaceCache.cache(workplace);
		return workplace;
	};

	getLocality = async(placeId:string) => {
		const cached = this._localityCache.retrieve(placeId);
		if(cached) return cached;
		const details = await this._googleClient.getPlaceDetails({
			placeId,
			fields : [ "name" ],
		});
		const locality = new Locality({ place_id:placeId,description:details.name || "" });
		this._localityCache.cache(locality);
		return locality;
	};

	myReviews = async() => {
		const { data }:any = await this._http.get("/api/jobreviews/myreviews");
		const __reviews = data.map((reviewId:string) => this._getReview(reviewId));
		console.log("Fetching reviews")
		const _reviews = await Promise.all(__reviews);
		const reviews = _reviews.filter((review:any)=>review ? true : false);
		return reviews;
	};

	reportReview = async({ reviewId }:Review,problem:string,description:string,reCaptcha:string) => {
		if(!reCaptcha) throw new InvalidRecaptchaException("Please, verify that you are not a robot");
		const { jReportObject } = JReport.new({ reviewId,problem,description });
		await this._http.post("/api/jobreviews/reportreview",{ jReportObject,reCaptcha });
	};

	// for moderation
	waitingReviews = async() => {
		const result:any = await this._http.get("/api/jobreviews/myreviews");
		console.log(result)
		const _reviews = result.data.map((reviewId:string) => this.getReview(reviewId));
		const reviews = await Promise.all(_reviews);
		return reviews;
	};

	restoreReview = async({ reviewId }:Review) => {
		await this._http.post("/api/jobreviews/restorereview",{ reviewId });
	};

	deleteReviewAndBanUser = async({ reviewId }:Review) => {
		await this._http.post("/api/jobreviews/deletereviewandbanuser",{ reviewId });
	};
};



export default JobReviews;




/*



*/
