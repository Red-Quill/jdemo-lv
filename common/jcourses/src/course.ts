import JJoi from "jjoi";



// --> description of raw data
const courseObjectSchema = JJoi.object().required().keys({
	_id: JJoi.string().required().allow(""),
	iconFileName: JJoi.string().required().allow(""),
	name: JJoi.string().required().allow(""),
}).options({ allowUnknown: true });

type courseObject = {
	_id: string,
	iconFileName: string;
	name: string;
}
// <-- description of raw data



class Course {
	_id: string;
	_name: string;
	_iconFileName: string;

	constructor(courseObject:courseObject) {
		JJoi.assert(courseObject,courseObjectSchema);
		const { _id,iconFileName,name } = courseObject;
		this._id = _id;
		this._name = name
		this._iconFileName = iconFileName;
	};

	get iconFileName() { return this._iconFileName };
	get name() { return this._name }
	get _object() {
		const course = {
			_id: this._id,
			name: this._name,
			iconFileName: this._iconFileName,
		};
		return course;
	};
};



const noCourse = new Course({ _id:"",iconFileName:"",name:"" });

export default Course;
export { noCourse };
