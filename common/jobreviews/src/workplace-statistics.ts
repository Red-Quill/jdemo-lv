import { JJoi } from "jjoi";
import { JSchema,UUID,Integer,zeroTime } from "jutils";


/*
Mutable part of workplace data
Workplace.new takes responsibility of creating new WorkplaceStatistics instance
*/

type WorkplaceStatisticsObject = {
	_id:string;
	scoreAverage:number;
	totalReviews:number;
	createdAt:Date;
	updatedAt:Date;
};

const workplaceStatisticsSchema = new JSchema({
	type : Object,
	keys : {
		_id : { type:UUID,required:true },
		scoreAverage : { type:Number,min:0,max:5,required:true },
		totalReviews : { type:Integer,min:0,required:true },
		createdAt : { type:Date,required:true },
		updatedAt : { type:Date,required:true },
	},
});



class WorkplaceStatistics {
	static schema = workplaceStatisticsSchema;
	_workplaceStatisticsObject:WorkplaceStatisticsObject;

	constructor(workplaceStatisticsObject:WorkplaceStatisticsObject) {
		const _workplaceStatisticsObject = JJoi.assert(workplaceStatisticsObject,workplaceStatisticsSchema);
		// @ts-ignore
		this._workplaceStatisticsObject = _workplaceStatisticsObject;
	}

	get workplaceStatistics() {return this;}
	get _id() {return this._workplaceStatisticsObject._id;}
	get workplaceStatisticsId() {return this._workplaceStatisticsObject._id;}
	get scoreAverage() {return this._workplaceStatisticsObject.scoreAverage;}
	get totalReviews() {return this._workplaceStatisticsObject.totalReviews;}
	get _object() {return this._workplaceStatisticsObject;}
	get workplaceStatisticsObject() {return this._workplaceStatisticsObject;}
}

const noWorkplaceStatistics = Object.create(WorkplaceStatistics.prototype,{
	_workplaceObject : { value:{ _id:"",scoreAverage:5,totalReviews:0,createdAt:zeroTime,updatedAt:zeroTime } },
});



export default WorkplaceStatistics;
export { WorkplaceStatistics,noWorkplaceStatistics };
