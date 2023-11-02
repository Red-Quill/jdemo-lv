import { v4 as uuidv4 } from "uuid";
import { JJoi } from "jjoi";
import { noWorkplace } from "./workplace.js";
import type { Workplace } from "./workplace.js";
import { JSchema,UUID,Integer,zeroTime } from "jutils";



type NewReview = {
	score:number,
	description:string,
	workplace:Workplace,
	[key:string]:any,
};

type ReviewObject = {
	_id:string;
	score:number,
	description:string,
	workplaceId:string, // google places api convention
	createdAt:Date;
	updatedAt:Date;
};

const reviewSchema = new JSchema({
	type : Object,
	keys : {
		_id : { type:UUID,required:true },
		score : { type:Integer,required:true },
		description : { type:String,required:true,minLength:50,maxLength:10_000 },
		workplaceId : { type:String,required:true },
		createdAt : { type:Date,required:true },
		updatedAt : { type:Date,required:true },
	},
});



class Review {
	static schema = reviewSchema;
	_reviewObject:ReviewObject;
	workplace:Workplace; // for storing reference to workplace object

	constructor(reviewObject:ReviewObject) {
		// @ts-ignore
		const _reviewObject = JJoi.assert(reviewObject,reviewSchema,{ convert:true }); // convert is bad option but currently have no better options
		// @ts-ignore
		this._reviewObject = _reviewObject;
		this.workplace = noWorkplace;
	}

	static new = ({
		workplace : { workplace,workplaceId },
		score,
		description
	}:NewReview) => {
		const now = new Date();
		const review = new Review({
			_id : uuidv4(),
			score,
			workplaceId,
			description,
			createdAt : now,
			updatedAt : now,
		});
		review.workplace = workplace;
		return review;
	};

	// @ts-ignore
	get schema() {return this.constructor.schema;}
	get review() {return this;}
	get _id() {return this._reviewObject._id;}
	get reviewId() {return this._reviewObject._id;}
	get workplaceId() {return this._reviewObject.workplaceId;}
	get score() {return this._reviewObject.score;}
	get description() {return this._reviewObject.description;}
	get createdAt() {return this._reviewObject.createdAt;}
	get updatedAt() {return this._reviewObject.updatedAt;}
	get _object() {return this._reviewObject;}
	get reviewObject() {return this._reviewObject;}
}

const noReview = Object.create(Review.prototype,{
	_reviewObject : { value:{ _id:"",workplaceId:"",description:"",score:0,createdAt:zeroTime,updateAt:zeroTime } },
	workplace : { value:noWorkplace },
});



export default Review;
export { Review,noReview };
