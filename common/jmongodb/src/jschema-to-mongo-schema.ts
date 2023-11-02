import { Schema as MongoSchema } from "mongoose";
import { JSchema,UUID,Integer } from "jutils";
import { v4 as uuidv4 } from "uuid";



const jSchemaToMongoSchema = (jSchema:JSchema,{ indices=[],timestamps=false,expires=0 }:any) => {
	const _mongoSchema = handleJSchema(jSchema);
	if(!_mongoSchema._id) _mongoSchema._id = { type:String,default:uuidv4 };
	if(expires) _mongoSchema.createdAt = { type:Date,default:Date.now,expires };
	const mongoSchema = new MongoSchema(_mongoSchema,{ timestamps });
	for(const { fields,options } of indices) {
		mongoSchema.index(fields,options);
	}
	return mongoSchema;
};

const handleJSchema = ({ schema }:JSchema) => {
	if(schema.type !== Object) throw new Error("Top level item must be of type Object");
	const _mongoSchema = objectHandler(schema);
	return _mongoSchema;
};



const handlers = new Map();

const standardHandler = (value:any) => value;

handlers.set(Number,standardHandler);
handlers.set(String,standardHandler);
handlers.set(Date,standardHandler);

type objectHandlerPT = {
	type:any;
	keys:{ [key:string]:any };
	[key:string]:any;
};

const objectHandler = ({ type,keys,allowUnknown,...rest }:objectHandlerPT) => {
	// possibly warn that allowUnknown is not supported
	console.log("--> jschema-to-mongo-schema objectHandler");
	const _mongoSchema:any = {};
	for(const [ key,definition ] of Object.entries(keys)) {
		const handler = handlers.get(definition.type);
		_mongoSchema[key] = handler(definition);
	}
	console.log("<-- jschema-to-mongo-schema objectHandler");
	return _mongoSchema;
};

handlers.set(Object,objectHandler);

type arrayHandlerPT = {
	type:any;
	values:any;
	[key:string]:any;
};

const arrayHandler = ({ type,values,...rest }:arrayHandlerPT) => {
	// possibly warn that allowUnknown is not supported
	console.log("--> jschema-to-mongo-schema arrayHandler");
	console.log(values);
	console.log(values.type);
	const valuesHandler = handlers.get(values.type);
	console.log(valuesHandler);
	const _mongoSchema:any = [ valuesHandler(values) ];
	console.log("<-- jschema-to-mongo-schema arrayHandler");
	return _mongoSchema;
};

handlers.set(Array,arrayHandler);

const integerHandler = ({ type,validate,...rest }:any) => {
	const _mongoSchema = {
		type : Number,
		...rest,
		validate : {
			validator : validate ? (_:any) => Integer.isInteger(_) && validate(_) : Integer.isInteger,
			message : "{VALUE} there was an error",
		},
	};
	return _mongoSchema;
};

handlers.set(Integer,integerHandler);

const uuidHandler = ({ type,...rest}:any) => {
	const _mongoSchema = {
		type : String,
		...rest,
		validate : {
			validator : UUID.validate,
			message : "{VALUE} is not a valid uuid",
		},
	};
	return _mongoSchema;
};

handlers.set(UUID,uuidHandler);



export default jSchemaToMongoSchema;
