import type { Schema } from "joi";
import { JSchema,UUID,Integer } from "jutils";
import JJoi from "./jjoi.js";



const jSchemaToJoiSchema = (jSchema:JSchema,options?:any):Schema => {
	const joiSchema1 = handleSchema(jSchema.schema);
	const joiSchema2 = options ? joiSchema1.options(options) : joiSchema1;
	return joiSchema2;
};



const handleSchema = (schema:any) => {
	const handler = handlers.get(schema.type);
	const joiSchema = handler(schema);
	return joiSchema;
};



const handlers = new Map<any,([any])=>Schema>();

type objectHandlerPT = {
	keys:{ [key:string]:any };
	[_:string]:any;
};

const objectHandler = ({ type,keys,allowUnknown,required,...rest }:objectHandlerPT) => {
	const joiSchemas:any = {};
	for(const [ key,schema ] of Object.entries(keys)) {
		const handler = handlers.get(schema.type);
		joiSchemas[key] = handler(schema)
	};
	const joiSchema1 = JJoi.object().keys(joiSchemas);
	const joiSchema2 = required ? joiSchema1.required() : joiSchema1;
	const joiSchema3 = allowUnknown ? joiSchema2.options({ allowUnknown:true }) : joiSchema2;
	return joiSchema3;
};

handlers.set(Object,objectHandler);

const handleArray = ([ value,...extra ]:any) => {
	throw new Error("Not yet impl");
	//if(extra.length) throw new Error("Cannot handle array with more than one descriptor");
	//const items = handleItem(value);
	//const result = JJoiLegacy.array().items(items);
	//return result;
};




const dateHandler = ({ required,...rest }:any) => {
	const dateSchema1 = JJoi.jDate();
	const dateSchema2 = required ? dateSchema1.required() : dateSchema1;
	// possibly check that rest is empty and if not, show warning or notice
	return dateSchema2;
};

handlers.set(Date,dateHandler);

const stringHandler = ({ required,validate,minLength,maxLength,...rest }:any) => {
	const stringSchema1 = JJoi.string();
	const stringSchema2 = minLength ? stringSchema1.min(minLength) : stringSchema1.allow("");
	const stringSchema3 = maxLength ? stringSchema2.max(maxLength) : stringSchema2;
	const stringSchema4 = required ? stringSchema3.required() : stringSchema3;
	if(validate) throw new Error("JJoi: custom validation for strings not yet implemented");
	// possibly check that rest is empty and if not, show warning or notice
	return stringSchema4;
};

handlers.set(String,stringHandler);

const numberHandler = ({ required,validate,min,max,...rest }:any) => {
	const numberSchema1 = JJoi.number();
	const numberSchema2 = min ? numberSchema1.min(min) : numberSchema1;
	const numberSchema3 = max ? numberSchema2.max(max) : numberSchema2;
	const numberSchema4 = required ? numberSchema3.required() : numberSchema3;
	if(validate) throw new Error("JJoi: custom validation for numbers not yet implemented");
	// possibly check that rest is empty and if not, show warning or notice
	return numberSchema4;
};

handlers.set(Number,numberHandler);

const integerHandler = ({ required,validate,min,max,...rest }:any) => {
	const integerSchema1 = JJoi.number().integer();
	const integerSchema2 = min ? integerSchema1.min(min) : integerSchema1;
	const integerSchema3 = max ? integerSchema2.max(max) : integerSchema2;
	const integerSchema4 = required ? integerSchema3.required() : integerSchema3;
	if(validate) throw new Error("JJoi: custom validation for integers not yet implemented");
	// possibly check that rest is empty and if not, show warning or notice
	return integerSchema4;
};

handlers.set(Integer,integerHandler);

const uuidHandler = ({ required,...rest }:any) => {
	const uuidSchema1 = JJoi.string().guid();
	const uuidSchema2 = required ? uuidSchema1.required() : uuidSchema1;
	// possibly check that rest is empty and if not, show warning or notice
	return uuidSchema2;
};

handlers.set(UUID,uuidHandler);



export default jSchemaToJoiSchema;



/*

const reviewSchema = new JSchema({
	_id : { type:UUID,required:true },
	score : { type:Integer,required:true },
	description : { type:String,required:true,minLength:50,maxLength:10_000 },
	workplaceId : { type:String,required:true },
	workplaceNameLowerCase : { type:String,required:true },
	place_id : { type:String,required:true },
	createdAt : Date,
	updatedAt : Date,
});

const reviewObjectSchema = JJoi.object().required().keys({
	_id : JJoi.string().guid().required(),
	score : JJoi.number().integer().min(0).max(5).required(),
	description : JJoi.string().min(50).max(10_000).required(),
	workplaceId : JJoi.string().required(),
	workplace : JJoi.object(),
	createdAt : JJoi.date(),
}).options({ allowUnknown:true });

*/