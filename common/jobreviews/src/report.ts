import { v4 as uuidv4 } from "uuid";
import { JJoi } from "jjoi";
import { JSchema,UUID, zeroTime } from "jutils";
import Review,{ noReview } from "./review.js";



const jreportSchema = new JSchema({
	type : Object,
	keys : {
		_id : { type:UUID,required:true },
		reviewId : { type:UUID,required:true },
		problem : { type:String,required:true },
		description : { type:String,required:true },
		createdAt : { type:Date,required:true },
		updatedAt : { type:Date,required:true },
	},
});

type JReportObject = {
	_id:string;
	reviewId:string;
	problem:string;
	description:string;
	createdAt:Date;
	updatedAt:Date;
};

type NewJReport = {
	reviewId:string;
	problem:string;
	description:string;
};

class JReport {
	static schema = jreportSchema;
	_jReportObject:JReportObject;
	review:Review;

	constructor(jReportObject:JReportObject) {
		JJoi.assert(jReportObject,jreportSchema);
		this._jReportObject = jReportObject;
		this.review = noReview;
	}

	static new = ({ reviewId,problem,description }:NewJReport) => {
		const now = new Date();
		const jReport = new JReport({
			_id : uuidv4(),
			reviewId,
			problem,
			description,
			createdAt : now,
			updatedAt : now,
		});
		return jReport;
	};

	get _id() {return this._jReportObject._id;}
	get jReportId() {return this._jReportObject._id;}
	get reviewId() {return this._jReportObject.reviewId;}
	get problem() {return this._jReportObject.problem;}
	get description() {return this._jReportObject.description;}
	get jReportObject() {return this._jReportObject;}
	get _object() {return this._jReportObject;}
}

const noJReport = Object.create(JReport.prototype,{
	_jReportObject : { value:{ _id:"",userId:"",problem:"",description:"",createdAt:zeroTime,updatedAt:zeroTime } },
	review : { value:noReview },
});



export default JReport;
export { noJReport };
/*


*/
