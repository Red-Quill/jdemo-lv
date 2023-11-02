import Joi from "joi";
import objectId from "./joi-objectid.js";



const JJoiLegacy = {
	...Joi,
	objectId,
	validate : (value:any,schema:Joi.Schema,options?:Joi.ValidationOptions) => schema.validate(value,options),
};



export default JJoiLegacy;
