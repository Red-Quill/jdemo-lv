import { v4 as uuidv4 } from "uuid";
import { JJoi } from "jjoi";
import { JSchema,UUID,zeroTime } from "jutils";
import WorkplaceStatistics,{ noWorkplaceStatistics } from "./workplace-statistics.js";
import Locality,{ noLocality } from "./locality.js";



/*
type Locality = {
	place_id:string;
	description:string;
	[key:string]:any;
};
*/
type NewWorkplace = {
	name:string;
	initialScore:number;
	locality:Locality;
	[key:string]:any;
};

type WorkplaceObject = {
	_id:string;
	name:string;
	workplaceNameLowerCase:string;
	place_id:string, // google places api convention
	workplaceStatisticsId:string;
	createdAt:Date;
	updatedAt:Date;
};

const workplaceSchema = new JSchema({
	type : Object,
	keys : {
		_id : { type:UUID,required:true },
		name : { type:String,required:true },
		workplaceNameLowerCase : { type:String,required:true },
		place_id : { type:String,required:true },
		//workplaceStatisticsId : { type:UUID,required:true },
		workplaceStatisticsId : { type:UUID },
		createdAt : { type:Date,required:true },
		updatedAt : { type:Date,required:true },
	},
});

//const workplaceObjectSchema = jSchemaToJoiSchema(workplaceSchema);



class Workplace {
	static schema = workplaceSchema;
	_workplaceObject:WorkplaceObject;
	locality:Locality; // for storing reference to locality
	workplaceStatistics:WorkplaceStatistics; // for storing reference to statistics

	constructor(workplaceObject:WorkplaceObject) {
		const _workplaceObject = JJoi.assert(workplaceObject,workplaceSchema);
		// @ts-ignore
		this._workplaceObject = _workplaceObject;
		this.locality = noLocality;
		this.workplaceStatistics = noWorkplaceStatistics;
	}

	static new = ({ name,locality,initialScore }:NewWorkplace) => {
		const now = new Date();
		const workplaceStatisticsId = uuidv4();
		const workplace = new Workplace({
			_id : uuidv4(),
			name,
			workplaceNameLowerCase : name.toLowerCase(),
			workplaceStatisticsId,
			place_id : locality.place_id,
			createdAt : now,
			updatedAt : now,
		});
		workplace.locality = locality;
		workplace.workplaceStatistics = new WorkplaceStatistics({
			_id : workplaceStatisticsId,
			scoreAverage : initialScore,
			totalReviews : 1,
			createdAt : now,
			updatedAt : now,
		});
		return workplace;
	};

	get workplace() {return this;}
	get _id() {return this._workplaceObject._id;}
	get workplaceId() {return this._workplaceObject._id;}
	get name() {return this._workplaceObject.name;}
	get workplaceNameLowerCase() {return this._workplaceObject.workplaceNameLowerCase;}
	get workplaceStatisticsId() {return this._workplaceObject.workplaceStatisticsId;}
	get place_id() {return this._workplaceObject.place_id;}
	get _object() {return this._workplaceObject;}
	get workplaceObject() {return this._workplaceObject;}
}

const noWorkplace = Object.create(Workplace.prototype,{
	_workplaceObject : { value:{ _id:"",name:"",workplaceNameLowerCase:"",place_id:"",createdAt:zeroTime,updateAt:zeroTime } },
	locality : { value:noLocality },
	workplaceStatistics : { value:noWorkplaceStatistics },
});



export default Workplace;
export { Workplace,noWorkplace };
