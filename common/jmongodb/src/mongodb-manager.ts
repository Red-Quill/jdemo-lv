import { JSchema } from "jutils";
import { Mongoose,Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import jSchemaToMongoSchema from "./jschema-to-mongo-schema";



/*
Tailored mongoDB module. It abstracts away some of the database management and
provides only methods for initial configuration and for specific use cases needed by
other modules in JServer system.

If I need to switch to other database implementation this module can be rewritten
with minimal changes to other modules in JServer.
*/

const mongooseUUID = { type:String,default:uuidv4 };

const metaSchema = new Schema({
	_id: mongooseUUID,
	tableName : { type:String,required:true,unique:true },
	createdAt : { type:Date,required:true },
	updatedAt : { type:Date,required:true },
},{ collection:"meta" });



class MongodbManager {
	_databaseConnection:any;
	_databaseClient:Mongoose;
	_dataBaseUrl:string;
	_dataBaseConfig:any;
	_tables:{ [name:string]:any };
	_Meta:any;
	_onceOpenCallbacks:any;

	constructor({ baseURL,name,username,password,useSsl,sslCAFilename,atlas }:any) {
		this._tables = {};
		this._onceOpenCallbacks = [];
		this._dataBaseConfig = {};
		if(atlas) {
			const { baseURL,password,username,dataBaseName } = atlas;
			this._dataBaseUrl = `mongodb+srv://${username}:${password}@${baseURL}/${dataBaseName}`;
			this._dataBaseConfig.ssl = true;
		} else {		
			this._dataBaseUrl = `mongodb://${baseURL}/${name}`;
			if(username) this._dataBaseConfig.user = username;
			if(password) this._dataBaseConfig.pass = password;
			if(useSsl) this._dataBaseConfig.ssl = useSsl;
			if(sslCAFilename) {
				this._dataBaseConfig.sslValidate = true;
				this._dataBaseConfig.sslCA = sslCAFilename;
			};
		}
		this._databaseClient = new Mongoose();
		this._Meta = this._databaseClient.model("meta",metaSchema,"meta");
	};

	connect = async() => {
		console.log("--> MongodbManager connect");
		if(this._databaseConnection) return console.warn("Already connected or trying to connect");
		this._databaseConnection = await this._databaseClient.connect(this._dataBaseUrl,this._dataBaseConfig);
		this._executeOnceOpenCallbacks();
		console.log("<-- MongodbManager connect");
	};

	disconnect = async() => {
		await this._databaseClient.disconnect();
	};

	onceOpen = async(callback:Function) => {
		if(this._databaseConnection)
			callback();
		else
			this._onceOpenCallbacks.push(callback);
	};

	_executeOnceOpenCallbacks = () => {
		for(const callback of this._onceOpenCallbacks) 
			callback();
		this._onceOpenCallbacks = [];
	}

	newTable = async(tableName:string,definition:any,options:any={}) => {
		console.log("--> mongodb-manager newTable", tableName);
		const mongooseSchema = definition instanceof JSchema ?
			jSchemaToMongoSchema(definition,options)
			:
			this._mongooseSchema(definition);
		const Model = this._databaseClient.model(tableName,mongooseSchema,tableName);
		this._tables[tableName] = Model;
		try {
			await this._setMeta(Model);
		} catch(error) {
			this.onceOpen(() => this._setMeta(Model));
		}
		console.log("<-- mongodb-manager newTable", tableName);
		//return tableName;
		return Model;
	};

	_mongooseSchema = ({ $indices=[],$timestamps=false,$expires=0,...schema }:any) => {
		const mongooseSchema = new Schema({
			_id : mongooseUUID,
			...($expires ?  { createdAt:{ type:Date,default:Date.now,expires:$expires } } : {}),
			...schema
		},{ timestamps:$timestamps });
		for(const { fields,options } of $indices) {
			mongooseSchema.index(fields,options);
		}
		return mongooseSchema;	
	};

	_setMeta = async(Table:any) => {
		const tableName = Table.collection.collectionName;
		const result = await this._Meta.findOne({ tableName });
		if(result) return;
		const now = new Date();
		await new this._Meta({ tableName,createdAt:now,updatedAt:now }).save();
	};

	_setLastUpdated = async(Table:any) =>  {
		this._Meta.updateOne({ tableName:Table.collection.collectionName },{ $set:{ updatedAt:new Date() } });
	}

	getLastUpdated = async(Table:any) => {
		const result = await this._Meta.findOne({ tableName:Table.collection.collectionName });
		const { updatedAt } = result.toObject();
		return updatedAt;
	};

	dropTable = async(Table:any) => {
		await Table.collection.drop();
		delete this._tables[Table.collection.collectionName];
		this._setLastUpdated(Table);
	};

	emptyTable = async(Table:any) => {
		await Table.remove({});
		this._setLastUpdated(Table);
	};

	save = async(Table:any,data:any) => {
		const result = await this._save(Table,data);
		this._setLastUpdated(Table);
		return result;
	};

	_save = async(Table:any,data:any) => {
		const entry = new Table(data);
		const result = await entry.save();
		return result;
	};

	replaceEntryObject = async(Table:any,data:any) => {
		const result = await Table.findOneAndReplace({ _id:data._id },data,{ new:true });
		this._setLastUpdated(Table);
		const _object = result && result.toObject();
		return _object;
	};

	newEntry = async(Table:any,entryData:any) => {
		if(entryData._id) throw new Error(`The "new" table entry for table ${Table.collection.collectionName} already has an _id`);
		const entry = new Table(entryData);
		const result = await entry.save();
		this._setLastUpdated(Table);
		return result;
	};

	newEntryObject = async(Table:any,entryData:any) => {
		const result = await this.newEntry(Table,entryData);
		const _object = result && result.toObject();
		return _object;
	};

	// newData is optional default document if document doesn't exist in database
	// this needs more testing
	updateOne = async(Table:any,query:any,update:any,newData:any) => {
		const existing = await Table.findOne(query);
		const entry = existing || await this._save(Table,newData);
		const result = await entry.updateOne(update);
		this._setLastUpdated(Table);
		console.log("updated one",result);
	};

	updateExistingOne = async(Table:any,query:any,update:any) => {
		const existing = await Table.findOne(query);
		const result = await existing.updateOne(update);
		this._setLastUpdated(Table);
		console.log("updated one",result);
	};

	update = async(Table:any,_id:string,update:any,newData:any) => {
		const existing = await Table.findById(_id);
		if(!existing && !newData) return { error:"No database entry found with specified id" };
		const entry = existing || await this._save(Table,newData);
		const result = await entry.updateOne(update);
		this._setLastUpdated(Table);
		//console.log(result);
		const _object = result && result.toObject();
		return _object;
	};

	updateExistingGet = async(Table:any,_id:string,update:any) => {
		const result = await Table.findByIdAndUpdate(_id,update,{ returnDocument:"before",new:true });
		const _object = result && result.toObject();
		this._setLastUpdated(Table);
		return _object;
	};

	updateExisting = async(Table:any,_id:string,update:any) => {
		await Table.findByIdAndUpdate(_id,update);
		this._setLastUpdated(Table);
	};

	getTable = async(Table:any) => {
		const table = await Table.find();
		return table;
	};

	getTableObjects = async(Table:any) => {
		const table = await this.getTable(Table);
		const objects = [];
		for(const document of table) {
			const object = document.toObject();
			objects.push(object);
		}
		return objects;
	};

	find = async(Table:any,query:any) => {
		const result = await Table.find(query);
		return result;
	};

	findOne = async(Table:any,query:any) => {
		const result = await Table.findOne(query).exec();
		return result;
	};

	findOneObject = async(Table:any,{ $$sort,...query }:any) => {
		console.log("--> mongodb manager findOneObject");
		const filtered = Table.findOne(query);
		const sorted = $$sort ? filtered.sort({ [$$sort[0]]:$$sort[1] }) : filtered;
		const result = await sorted.exec();
		const _object = result?.toObject();
		console.log("<-- mongodb manager findOneObject");
		return _object;
	};

	findById = async(Table:any,_id:string) => {
		console.log("--> MongodbManager findById");
		const result = await Table.findById(_id).select("-__v");
		console.log("<-- MongodbManager findById");
		return result;
	};

	findByIdObject = async(Table:any,_id:string) => {
		console.log("--> MongodbManager findByIdObject");
		const result = await this.findById(Table,_id);
		const _object = result && result.toObject();
		console.log("<-- MongodbManager findByIdObject");
		return _object;
	};

	removeById = async(Table:any,_id:string) => {
		const result = await Table.findByIdAndDelete(_id);
		const _object = result && result.toObject();
		return _object;
	};

	findIds = async(Table:any,{ $$sort,$$first=0,$$last=0,...query }:any) => {
		const filtered = Table.find(query).select("_id");
		const sorted = $$sort ? filtered.sort({ [$$sort[0]]:$$sort[1] }) : filtered;
		const _sliced = $$first ? filtered.skip($$first) : sorted;
		const sliced = $$last ? _sliced.limit($$last-$$first) : _sliced;
		const results = await sliced.exec();
		//console.log("===results===")
		//console.log(results);
		//console.log("^==results===")
		const ids = results.map(({ _id }:any) => _id);
		return ids;
	};

	count = async(Table:any,query:any) => {
		const count = await Table.countDocuments(query);
		return count;
	};

	exists = async(Table:any,query:any) => {
		const exists = await Table.exists(query);
		return exists;
	};

	// CHECK!!!
	removeOne = async(Table:any,query:any) => {
		const result = await Table.deleteOne(query);
		const _object = result && result.toObject();
		this._setLastUpdated(Table);
		return _object;
	};

	// kesken
	watchDeletion = async(Table:any,callback:Function) => {
		Table.watch().on("change",(event:any) => {
			//console.log(event);
			if(event.operationType === "delete") callback();
		});
	};
};



export default MongodbManager;

/*

*/