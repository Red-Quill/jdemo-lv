import Integer from "./integer.js";
import UUID from "./uuid.js";



type SchemaDefinition = {
	type : any,
	[key:string]:any,
}

class JSchema {
	schema:any;
	[key:string]:any; // it is okay to save e.g. inferred Joi or mongodb schemas here

	constructor(schema:any) {
		this.schema = processSchema(schema);
	}
};

const processSchema = (schema:any) => {
	if(schema instanceof JSchema) return schema.schema;
	if(schema.constructor === Object) return processDefinition(schema);
	if(defaultSchemas.has(schema)) return defaultSchemas.get(schema);
	throw new Error("Invalid schema definition");
};

const processDefinition = (definition:SchemaDefinition) => {
	if(definition.type === Object) return processObjectDefinition(definition);
	if(definition.type === Array) return processArrayDefinition(definition);
	return definition;
};

const processObjectDefinition = (definition:SchemaDefinition) => {
	const { keys,...rest } = definition.extend ?
		processObjectDefinitionExtend(definition)
		:
		definition;
	const newKeys:any = {};
	for(const [ key,schema ] of Object.entries(keys)) {
		newKeys[key] = processSchema(schema);
	}
	const newDefinition = { keys:newKeys,...rest };
	return newDefinition;
};

const processObjectDefinitionExtend = ({ extend,keys,allowUnknown,...rest }:SchemaDefinition) => {
	const newDefinition:any = {
		type : Object,
		keys : {},
		allowUnknown : keys ? false : true,
	};
	const extendees = Array.isArray(extend) ? extend : [ extend ];
	for(const { schema:{ type,keys,allowUnknown,...rest } } of extendees) {
		if(type !== Object) throw new Error("Not an object");
		if(allowUnknown) newDefinition.allowUnknown = true;
		Object.assign(newDefinition,rest);
		Object.assign(newDefinition.keys,keys);
	}
	if(allowUnknown) newDefinition.allowUnknown = true;
	Object.assign(newDefinition,rest);
	Object.assign(newDefinition.keys,keys);
	return newDefinition;
};

const processArrayDefinition = ({ values,...rest }:SchemaDefinition) => {
	const newDefinition:any = {
		values : processSchema(values),
		...rest
	};
	return newDefinition;
};



const defaultSchemas = new Map();
defaultSchemas.set(Object,{ type:Object,allowUnknown:true,keys:{} }); // check if this works!!??
defaultSchemas.set(String,{ type:String });
defaultSchemas.set(Number,{ type:Number });
defaultSchemas.set(Integer,{ type:Integer });
defaultSchemas.set(Boolean,{ type:Boolean });
defaultSchemas.set(UUID,{ type:UUID });



export default JSchema;
