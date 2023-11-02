
type localityObject = {
	place_id:string;
	description:string;
	[key:string]:any;
};

class Locality {
	_place_id:string; // google place_id
	_description:string;
	
	constructor({ place_id,description }:localityObject) {
		this._place_id = place_id;
		this._description = description;
	};

	get _id() {return this._place_id;} // for caching
	get place_id() {return this._place_id;}
	get description() {return this._description;}
};

const noLocality = new Locality({ place_id:"",description:"" });



export default Locality;
export { Locality,noLocality };
