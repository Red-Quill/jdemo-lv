import Joi from "joi";
import type { Schema } from "joi";
import { JSchema } from "jutils";
import objectId from "./joi-objectid.js";
import jDate from "./jdate.js";
import jSchemaToJoiSchema from "./jschema-to-joi-schema.js";



// -->
const getJoiSchema = (jSchema:JSchema) => {
	if(!jSchema.joiSchema) jSchema.joiSchema = jSchemaToJoiSchema(jSchema);
	return jSchema.joiSchema;
};
// <--

const validate = (value:any,jSchema:JSchema,options?:Joi.ValidationOptions) => {
	const joiSchema = getJoiSchema(jSchema);
	const result = joiSchema.validate(value,options);
	return result;
};

const assert = (value:any,jSchema:JSchema,options?:Joi.ValidationOptions) => {
	console.log("--> jjoi assert");
	const joiSchema = getJoiSchema(jSchema);
	const result = Joi.attempt(value,joiSchema,options);
	console.log("<-- jjoi assert");
	return result;
};

const JJoi = {
	string : Joi.string,
	number : Joi.number,
	boolean : Joi.boolean,
	object : Joi.object,
	array : Joi.array,
	objectId,
	jDate,

	validate,
	assert,
};



export default JJoi;
