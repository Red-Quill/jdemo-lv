import JJoi from "jjoi";



const coursePartTheoryObjectSchema = JJoi.object().required().keys({
	t: JJoi.string().required(),
});

type coursePartTheoryObject = {
	t: string;
}



class CoursePartTheory {
	_theory: string; // html string

	constructor(coursePartTheoryObject: coursePartTheoryObject) {
		JJoi.assert(coursePartTheoryObject, coursePartTheoryObjectSchema)
		const { t } = coursePartTheoryObject;
		this._theory = t;
	}

	get theory() { return this._theory }
}



export default CoursePartTheory;
