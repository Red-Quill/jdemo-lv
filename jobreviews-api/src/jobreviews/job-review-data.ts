import { JSchema,UUID,Integer } from "jutils";
import { JReport, Review } from "jobwarnings-shared";



const reviewDataBaseSchema = new JSchema({
	type : Object,
	extend : Review.schema,
	keys : {
		userId : { type:UUID,required:true },
		workplaceNameLowerCase : { type:String,required:true }, // query (search) help
		place_id : { type:String,required:true }, // query (search) help
		status : { type:String,required:true },
	},
});

const myreviewsSchema = new JSchema({
	type : Object,
	keys : {
		//_id : { type:UUID,required:true }, // let mongoose autogenerate it
		userId : { type:String,required:true,unique:true },
		reviewIds : { type:Array,values:String,required:true },
	},
});

const jReportDataBaseSchema = new JSchema({
	type : Object,
	extend : JReport.schema,
	keys : {
		userId : { type:UUID,required:true },
	},
});

const handledJReportDataBaseSchema = new JSchema({
	type : Object,
	extend : jReportDataBaseSchema,
	keys : {
		comment : { type:String,required:true },
		expires : { type:Date,required:true,expires:1 }, // expires 1 second after date
	},
});

const audittrailSchema = {
	userId : { type:String,required:true },
	tableName : { type:String,required:true },
	action : String,
	createdAssetId : { type:String,unique:true },
	deletedAssetId : { type:String,unique:true },
	modifiedAssetId : String,
	info : String,
	$timestamps : true,
	$indices : [
		{ fields:{ userId:1,createdAssetId:1 },options:{ unique:true } },
		{ fields:{ userId:1,deletedAssetId:1 },options:{ unique:true } },
		{ field : { modifiedAssetId:1 } },
	],
};



export { myreviewsSchema,audittrailSchema,reviewDataBaseSchema,jReportDataBaseSchema,handledJReportDataBaseSchema };



/*
const reviewSchema = {
	score : { type:Number,required:true },
	description : { type:String,required:true },
	workplaceId : { type:String,required:true },
	workplaceNameLowerCase : { type:String,required:true },
	place_id : { type:String,required:true },
	$timestamps : true,
};
*/
