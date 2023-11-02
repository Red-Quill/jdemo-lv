import type { MongodbManager } from "jmongodb";
import { myreviewsSchema,audittrailSchema,reviewDataBaseSchema,jReportDataBaseSchema,handledJReportDataBaseSchema } from "./job-review-data";
import { Review,Workplace,NoWorkplaceException,NoReviewException,WorkplaceStatistics,NoWorkplaceStatisticsException, JReport } from "jobwarnings-shared";
import type { User } from "juser";
import { v4 as uuidv4 } from "uuid";
import { jdebug } from "jutils";



class JobReviewsManager {
	_databaseManager:MongodbManager;
	_reviews:any;
	_deletedReviews:any;
	_waitingReviews:any;
	_workplaces:any;
	_workplaceStatistics:any;
	_myreviews:any;
	_reports:any;
	_handledReports:any;
	_audittrail:any;

	constructor() {}

	init = async(databaseManager:MongodbManager) => {
		this._databaseManager = databaseManager;
		this._reviews = await this._databaseManager.newTable("reviews",reviewDataBaseSchema,{ timestamps:true });
		this._deletedReviews = await this._databaseManager.newTable("deletedreviews",reviewDataBaseSchema,{ timestamps:true });
		this._waitingReviews = await this._databaseManager.newTable("waitingreviews",reviewDataBaseSchema,{ timestamps:true });
		this._workplaces = await this._databaseManager.newTable("workplaces",Workplace.schema,{ timestamps:true });
		this._workplaceStatistics = await this._databaseManager.newTable("workplacestatistics",WorkplaceStatistics.schema,{ timestamps:true });
		this._myreviews = await this._databaseManager.newTable("myreviews",myreviewsSchema);
		this._reports = await this._databaseManager.newTable("reports",jReportDataBaseSchema);
		this._handledReports = await this._databaseManager.newTable("handledreports",handledJReportDataBaseSchema);
		this._audittrail = await this._databaseManager.newTable("audittrail",audittrailSchema);
	};

	/////////////////////
	// --> maintenance //
	/////////////////////
	calculateTotalsAndAverages = async() => {
		console.log("--> calculateTotalsAndAverages")
		const xxx:{ [workplaceId:string]:number[] } = {};
		const reviews = await this._databaseManager.find(this._reviews,{});
		reviews.forEach(({ workplaceId,score }:any) => {
			if(!xxx[workplaceId]) xxx[workplaceId] = [];
			xxx[workplaceId].push(score);
		});

		for(const [ workplaceId,scores ] of Object.entries(xxx)) {
			console.log("upgrading",workplaceId);
			const totalReviews = scores.length;
			const scoreAverage = this._calculateScoreAverage(scores);
			console.log(totalReviews,scoreAverage);
			await this._databaseManager.updateExisting("workplaces",workplaceId,{ $set:{ totalReviews,scoreAverage} });
		}
		console.log("<-- calculateTotalsAndAverages")
	};

	_calculateScoreAverage = (scores:number[]) => {
		Math.round(10 * scores.reduce((a:number,b:number) => (a+b)) / scores.length) / 10;
	};
	/////////////////////
	// <-- maintenance //
	/////////////////////

	////////////////
	// --> search //
	////////////////
	searchReviews = async({ workplaceNameLowerCase="",localities=[],sortBy=[ "createdAt","descending" ],first=0,last=10 }:any={}) => {
		jdebug.message("--> JobReviewsManager searchReviews");
		const filter = {
			...(workplaceNameLowerCase ? { workplaceNameLowerCase:{ $regex:workplaceNameLowerCase } } : {} ),
			...(localities.length ? { place_id : { $in:localities } } : {}),
		};
		const reviewIds = await this._databaseManager.findIds(this._reviews,{
			...filter,
			$$sort : sortBy,
			$$first : first,
			$$last : last,
		});
		const total = await this._databaseManager.count(this._reviews,filter);
		jdebug.message("<-- JobReviewsManager searchReviews");
		return { reviewIds,total };
	};

	searchWorkplaces = async({ nameLowerCase="",localities=[],sortBy=[ "createdAt","descending" ],first=0,last=10 }:any={}) => {
		const filter = {
			...(nameLowerCase ? { nameLowerCase:{ $regex:nameLowerCase } } : {}),
			...(localities.length ? { place_id : { $in:localities } } : {}),
		};
		const workplaceIds = await this._databaseManager.findIds(this._workplaces,{
			...filter,
			$$sort : sortBy,
			$$first : first,
			$$last : last,
		});
		const total = await this._databaseManager.count(this._workplaces,filter);
		return { workplaceIds,total };
	};

	searchWorkplaceReviews = async({ workplaceId,sortBy=[ "createdAt","descending" ],first=0,last=10 }:any={}) => {
		const filter = {
			workplaceId,
		};
		const reviewIds = await this._databaseManager.findIds(this._reviews,{
			...filter,
			$$sort : sortBy,
			$$first : first,
			$$last : last,
		});
		const total = await this._databaseManager.count(this._reviews,filter);
		return { reviewIds,total };
	};
	////////////////
	// <-- search //
	////////////////

	///////////////////////
	// --> data fetching //
	///////////////////////
	getReviewObject = async(_id:string) => {
		const _reviewObject = await this._databaseManager.findByIdObject(this._reviews,_id);
		if(!_reviewObject) throw new NoReviewException();
		const { userId,workplaceNameLowerCase,place_id,nameLowerCase,status,...reviewObject } = _reviewObject;
		return reviewObject;
	};

	getWorkplaceObject = async(_id:string) => {
		const workplaceObject = await this._databaseManager.findByIdObject(this._workplaces,_id);
		if(!workplaceObject) throw new NoWorkplaceException();
		return workplaceObject;
	};

	getWorkplaceStatisticsObject = async(_id:string) => {
		const workplaceStatisticsObject = await this._databaseManager.findByIdObject(this._workplaceStatistics,_id);
		if(!workplaceStatisticsObject) throw new NoWorkplaceStatisticsException();
		return workplaceStatisticsObject;
	};

	getReview = async(_id:string) => {
		const reviewObject = await this.getReviewObject(_id);
		const review = new Review(reviewObject);
		return review;
	};

	getWorkplace = async(_id:string) => {
		const workplaceObject = await this.getWorkplaceObject(_id);
		const workplace = new Workplace(workplaceObject);
		return workplace;
	};

	getMyReviews = async({ userId }:User) => {
		const { reviewIds=[] } = await this._databaseManager.findOneObject(this._myreviews,{ userId }) || {};
		//const reviewIds = result ? result.reviewIds.map(({ reviewId }:any) =>  reviewId) : [];
		return reviewIds;
	};
	///////////////////////
	// <-- data fetching //
	///////////////////////

	////////////////////////
	// --> user functions //
	////////////////////////
	addReview = async({ reviewId,workplaceId,score,reviewObject }:Review,{ userId }:User) => {
		jdebug.message("--> JobReviewsManager addReview");
		const { workplaceNameLowerCase,place_id,workplaceStatisticsId } = await this._databaseManager.findById(this._workplaces,workplaceId);
		const { scoreAverage:_scoreAverage,totalReviews:_totalReviews } = await this._databaseManager.findById(this._workplaceStatistics,workplaceStatisticsId);
		const entry = { userId,workplaceNameLowerCase,place_id,status:"unchecked",...reviewObject };
		await this._databaseManager.save(this._reviews,entry);
		//await this._databaseManager.save(this._audittrail,{ tableName:"reviews",userId,createdAssetId:_id });
		await this._databaseManager.updateOne(this._myreviews,{ userId },
			{ $push:{ reviewIds:reviewId } },
			{ userId,reviewIds:[] },
		);
		const totalReviews = _totalReviews + 1;
		const scoreAverage = Math.round(10 * (_totalReviews*_scoreAverage + score) / totalReviews) / 10;
		await this._databaseManager.updateExisting(this._workplaceStatistics,workplaceStatisticsId,{ $set:{ totalReviews,scoreAverage } });
		jdebug.message("<-- JobReviewsManager addReview");
	};

	newReview = async({ reviewId,reviewObject,workplace:{ workplaceObject,workplaceNameLowerCase,place_id,workplaceStatistics:{ workplaceStatisticsObject } } }:Review,{ userId }:User) => {
		jdebug.message("--> JobReviewsManager newReview");
		const entry = { userId,workplaceNameLowerCase,place_id,status:"unchecked",...reviewObject };
		await this._databaseManager.save(this._workplaces,workplaceObject);
		await this._databaseManager.save(this._workplaceStatistics,workplaceStatisticsObject);
		await this._databaseManager.save(this._reviews,entry);
		//await this._databaseManager.save(this._audittrail,{ tableName:"reviews",userId,createdAssetId:_id });
		await this._databaseManager.updateOne(this._myreviews,{ userId },
			{ $push:{ reviewIds:reviewId } },
			{ userId,reviewIds:[] },
		);
		jdebug.message("<-- JobReviewsManager newReview");
	};

	newReviewAssertRateLimit = async({ userId }:User) => {
		const myreviews = await this._databaseManager.findOne(this._myreviews,{ userId });
		if(!myreviews) return;
		const { reviews } = myreviews;
		const len = reviews.length;
		if(len < 2) return;
		const now = Date.now();
		// 1 d
		if(now - reviews[len-3].createdAt.getMilliseconds() > 86_400_000) throw new Error("Too many reviews");
		if(len < 4) return;
		// 1 month
		if(now - reviews[len-4].createdAt.getMilliseconds() > 2_592_000_000) throw new Error("Too many reviews");
		if(len < 5) return;
		// 4 months
		if(now - reviews[len-5].createdAt.getMilliseconds() > 10_368_000_000) throw new Error("Too many reviews");
		if(len < 6) return;
		// 1 a
		if(now - reviews[len-6].createdAt.getMilliseconds() > 31_536_000_000) throw new Error("Too many reviews");
	};

	deleteMyReview = async(reviewId:string,{ userId }:User) => {
		jdebug.message("--> JobReviewsApi deleteMyReview");
		const reviewObject = await this._databaseManager.findByIdObject(this._reviews,reviewId);
		if(!reviewObject) throw new NoReviewException();
		// TMP, TODO in the future ALL reviews have userId recorded
		if(reviewObject.userId) {
			if(reviewObject.userId !== userId) throw new Error("Removing review failed");
		} else {
			reviewObject.userId = userId;
		}
		reviewObject.status = "deleted by user";
		await this._databaseManager.save(this._deletedReviews,reviewObject);
		await this._databaseManager.removeById(this._reviews,reviewId);
		//await this._databaseManager.save(this._audittrail,{ tableName:"reviews",userId,deletedAssetId:reviewId });
		await this._databaseManager.updateExistingOne(this._myreviews,{ userId },{ $pull:{ reviewIds:reviewId } });
		jdebug.message("<-- JobReviewsApi deleteMyReview");
	};

	// --> Reporting (spam etc)
	reportReview = async({ reviewId,jReportObject }:JReport,{ userId }:User) => {
		jdebug.message("--> JobReviewsManager reportReview");
		// find latest report on this asset
		const reviewData = 
			await this._databaseManager.findById(this._reviews,reviewId)
			||
			await this._databaseManager.findById(this._waitingReviews,reviewId);
		if(!reviewData) throw new NoReviewException();

		if(reviewData.status === "safe") return;
		// IF review has status "safe, drop report silently"

		await this._databaseManager.save(this._reports,{
			userId,
			...jReportObject
		});/* TMP
		if(number > 3 && inReviews) {
			const reviewObject = await this._databaseManager.findByIdObject(this._reviews,reviewId);
			await this._databaseManager.save(this._waitingReviews,reviewObject);
			await this._databaseManager.removeById(this._reviews,reviewId);
		}*/
		jdebug.message("<-- JobReviewsManager reportReview");
	};
	////////////////////////
	// <-- user functions //
	////////////////////////

	/////////////////////////
	// --> moderator tools //
	/////////////////////////
	deleteReview = async(reviewId:string,{}:User) => {
		jdebug.message("--> JobReviewsApi deleteReview");
		const reviewObject = await this._databaseManager.findByIdObject(this._reviews,reviewId);
		if(!reviewObject) throw new NoReviewException();
		const userId = reviewObject.userId; // creator's userId
		reviewObject.status = "deleted by moderator";
		if(!reviewObject.userId) reviewObject.userId = "015513be-c6ee-4318-bcc1-5d4ac26e7458"; // TMP, my testing account .mx@gmail.com
		await this._databaseManager.save(this._deletedReviews,reviewObject);
		console.log("Review put to delted reviews database",reviewId)
		await this._databaseManager.removeById(this._reviews,reviewId);
		//await this._databaseManager.save(this._audittrail,{ tableName:"reviews",userId,deletedAssetId:reviewId });
		if(userId) await this._databaseManager.updateExistingOne(this._myreviews,{ userId },{ $pull:{ reviewIds:reviewId } });
		jdebug.message("<-- JobReviewsApi deleteReview");
	};

	restoreReview = async(reviewId:string,comment:string) => {
		
	};
	/////////////////////////
	// <-- moderator tools //
	/////////////////////////


	// <-- Reporting
};



export default JobReviewsManager;




/*
TODO
rules: 1 post/user/workplace, 2 posts/user/day, 3 posts/user/month, 4 posts/user/6 months, 5 posts/user/year

	convertStatistics = async() => {
		console.log("--> convert statistics")
		const jes = await this._workplaces.find({}).select("-__v").exec();
		console.log(jes)
		const jex = jes.map((x:any) => {
			const { scoreAverage,totalReviews,createdAt,updatedAt } = x;
			const _id = uuidv4();
			const wpst = new WorkplaceStatistics({ _id,scoreAverage,totalReviews,createdAt,updatedAt });
			const y = x.toObject();
			delete y.scoreAverage;
			delete y.totalReviews;
			y.workplaceStatisticsId = _id;
			const wp = new Workplace(y); 
			return [ wp,wpst];
		});
		console.log(jex);
		for(const [ wp,wpst ] of jex) {
			console.log(wp);
			console.log(wpst);

			await this._databaseManager.save("workplacestatistics",wpst._object);
			await this._databaseManager.updateExisting("workplaces",wp._id,{ $unset:{ scoreAverage:1,totalReviews:1 },$set:{ workplaceStatisticsId:wpst._id } })

		}
		console.log("<-- convert statistics")
	};

	addSamplePlaces = async() => {
		for(const place of testdata) {
			console.log("===adding===")
			console.log(place);
			// @ts-ignore
			place.workplace.nameLowerCase = place.workplace.name.toLowerCase();
			console.log(place.workplace);
			//const workplace = Workplace.new(place.workplace); TMP
			console.log("AAAAA")
			//const review = Review.new({ workplace,description:place.review,score:place.score }) TMP away
			console.log("BBBBB")
			//await this.newWorkplace(workplace,noUser); TMP away
			console.log("CCCC")
			//await this.newReview(review,noUser);
			console.log("DDDDD")
		}
	}


*/




const testdata = [
	{
		"_id": "906f71d3-4d1b-4f52-8dd9-0f6935d6e555",
		"workplace": {
			"name": "ABC Inc.",
			"place_id": "ChIJOwg_06VPwokRYv534QaPC8g",
		},
		"score": 4,
		"review": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
	},
	{
		"_id": "1ffab9a1-29e7-4295-8aae-f169ed4e02b5",
		"workplace": {
			"name": "XYZ Ltd.",
			"place_id": "ChIJE9on3F3HwoAR9AhGJW_fL-I",
		},
		"score": 5,
		"review": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
	},
	{
		"_id": "e6321e36-cc0f-4f4e-8eb0-6e04821f4c19",
		"workplace": {
			"name": "PQR Corporation",
			"place_id": "ChIJdd4hrwug2EcRmSrV3Vo6llI",
		},
		"score": 3,
		"review": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
	},
	{
		"_id": "20e18600-d742-43ca-b3ec-697b8822623d",
		"workplace": {
			"name": "LMN Enterprises",
			"place_id": "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
		},
		"score": 2,
		"review": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."
	},
	{
		"_id": "d1d34f6d-1d75-40dd-9ff5-e6b82c54671a",
		"workplace": {
			"name": "EFG Co.",
			"place_id": "ChIJ51cu8IcbXWARiRtXIothAS4",
		},
		"score": 4,
		"review": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		"_id": "6c82ab9a-5b56-4e64-b6cd-5d53ea260a3e",
		"workplace": {
			"name": "RST Industries",
			"place_id": "ChIJP3Sa8ziYEmsRUKgyFmh9AQM",
		},
		"score": 5,
		"review": "Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."
	},
	{
		"_id": "9deed264-8a88-439f-848a-2ef15a416ab6",
		"workplace": {
			"name": "UVW Limited",
			"place_id": "ChIJW6AIkVXemwARTtIvZ2xC3FA",
		},
		"score": 3,
		"review": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis."
	},
	{
		"_id": "2a7f3e72-4c41-4d20-af1a-3cf53d205c6d",
		"workplace": {
			"name": "JKL Corp.",
			"place_id": "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
		},
		"score": 2,
		"review": "Soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat."
	},
	{
		"_id": "c89cd4db-49e1-49e3-b3da-496a2ca5a888",
		"workplace": {
			"name": "MNO Tech",
			"place_id": "ChIJ674hC6Y_WBQRujtC6Jay33k",
		},
		"score": 4,
		"review": "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat."
	},
	{
		"_id": "a156aa01-555e-4085-97d7-ebc36b6d1b1a",
		"workplace": {
			"name": "GHI Services",
			"place_id": "ChIJAVkDPzdOqEcRcDteW0YgIQQ",
		},
		"score": 5,
		"review": "Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae."
	},
	{
		"_id": "0f23eb8c-5a95-4e1c-a4ff-c26a1ea940a0",
		"workplace": {
			"name": "DEF Solutions",
			"place_id": "ChIJRcbZaklDXz4RYlEphFBu5r0",
		},
		"score": 3,
		"review": "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
	},
	{
		"_id": "5976c8d4-03ed-4c27-af36-3272ea0eaf66",
		"workplace": {
			"name": "IJK Innovations",
			"place_id": "ChIJu46S-ZZhLxMROG5lkwZ3D7k",
		},
		"score": 2,
		"review": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
	},
	{
		"_id": "1fcde49c-6af3-4d42-99b4-08c0e70c8265",
		"workplace": {
			"name": "NOP Services",
			"place_id": "ChIJpTvG15DL1IkRd8S0KlBVNTI",
		},
		"score": 4,
		"review": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam."
	},
	{
		"_id": "78b97101-e77e-4f24-836d-0725c6f53939",
		"workplace": {
			"name": "QRS Inc.",
			"place_id": "ChIJybDUc_xKtUYRTM9XV8zWRD0",
		},
		"score": 5,
		"review": "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
	},
	{
		"_id": "4c63d2d6-04d7-4fc3-aad4-2f3d68d7c6f7",
		"workplace": {
			"name": "XYZ Ltd.",
			"place_id": "ChIJ82ENKDJgHTERIEjiXbIAAQE",
		},
		"score": 3,
		"review": "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
	},
	{
		"_id": "ae46d8fc-91b4-492a-a2a5-9404375f4edc",
		"workplace": {
			"name": "ABC Inc.",
			"place_id": "ChIJzzlcLQGifDURm_JbQKHsEX4",
		},
		"score": 2,
		"review": "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
	},
	{
		"_id": "5f238c4d-d685-458e-9b9a-94e0ab62dbed",
		"workplace": {
			"name": "MNO Tech",
			"place_id": "ChIJ8UNwBh-9oRQR3Y1mdkU1Nic",
		},
		"score": 4,
		"review": "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam."
	},
	{
		"_id": "3e5f01b3-6a87-4ea5-b2e4-2f59768e7ea6",
		"workplace": {
			"name": "EFG Co.",
			"place_id": "ChIJawhoAASnyhQR0LABvJj-zOE",
		},
		"score": 5,
		"review": "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."
	},
	{
		"_id": "b04a352a-67c2-4f7a-9250-8cf97138f198",
		"workplace": {
			"name": "QRS Inc.",
			"place_id": "ChIJIz2AXDxTUkYRuGeU5t1-3QQ",
		},
		"score": 3,
		"review": "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
	}
]


