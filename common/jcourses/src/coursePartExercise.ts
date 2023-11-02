import JJoi from "jjoi";



const coursePartExerciseObjectSchema = JJoi.object().required().keys({
	n : JJoi.string().required(),
	a : JJoi.string().required(),
	h : JJoi.string().required().allow(""),
	r : JJoi.string().required().allow(""),
	s : JJoi.string().required().allow(""),
});

type coursePartExerciseObject = {
	n : string;
	a : string;
	h : string;
	r : string;
	s : string;
}



class CoursePartExercise {
	_number:string;
	_assignment:string; // all following are html strings
	_help:string;
	_rightAnswer:string;
	_solution:string;


	constructor(coursePartExerciseObject:coursePartExerciseObject) {
		JJoi.assert(coursePartExerciseObject,coursePartExerciseObjectSchema)
		const { n,a,h,r,s } = coursePartExerciseObject;
		this._number = n;
		this._assignment = a;
		this._help = h;
		this._rightAnswer = r;
		this._solution = s;
	}

	get number() { return this._number }
	get assignment() { return this._assignment }
	get help() { return this._help }
	get rightAnswer() { return this._rightAnswer }
	get solution() { return this._solution }
}



export default CoursePartExercise;
