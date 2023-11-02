import JJoi from "jjoi";



// --> description of raw data
const courseDataPartObjectSchema = JJoi.object().required().keys({
	_id : JJoi.string().required(),
	type : JJoi.string().required(),
});

const courseDataSectionObjectSchema = JJoi.object().required().keys({
	_id : JJoi.string().required(),
	header : JJoi.string().required(),
	parts : JJoi.array().items(courseDataPartObjectSchema).empty()
});

const courseDataIntroObjectSchema = JJoi.object().required().keys({
	_id : JJoi.string().required().allow(""),
	parts : JJoi.array().items(courseDataPartObjectSchema).empty()
});

const courseDataChapterObjectSchema = JJoi.object().required().keys({
	_id : JJoi.string().required(),
	header : JJoi.string().required(),
	intro : JJoi.alternatives().try(courseDataSectionObjectSchema, JJoi.allow(null)),
	sections : JJoi.array().items(courseDataSectionObjectSchema).empty(JJoi.array().length(0))
});

const courseDataObjectSchema = JJoi.object().required().keys({
	title : JJoi.string().required().allow(""),
	intro : JJoi.alternatives().try(courseDataIntroObjectSchema, JJoi.allow(null)), // possibly remove allow null
	chapters : JJoi.array().items(courseDataChapterObjectSchema).empty(JJoi.array().length(0)),
});

type courseDataObject = {
	title : string;
	intro : courseDataSectionObject|null;
	chapters : courseDataChapterObject[];
}

type courseDataChapterObject = {
	_id : string;
	header : string;
	intro: courseDataSectionObject;
	sections : courseDataSectionObject[];
}

type courseDataSectionObject = {
	_id : string;
	header : string;
	parts : courseDataPartObject[];
}

type courseDataPartObject = {
	type : string;
	_id : string;
}
// <-- description of raw data



class CourseData {
	_title: string;
	_intro: CourseDataIntro|null;
	_chapters: CourseDataChapter[];

	constructor(courseDataObject:courseDataObject) {
		JJoi.assert(courseDataObject,courseDataObjectSchema);
		const { title, intro, chapters } = courseDataObject;
		this._title = title;
		this._intro = intro ? new CourseDataIntro(intro) : null;
		this._chapters = chapters.map((chapter) => new CourseDataChapter(chapter));
	};

	get title() { return this._title };
	get intro() { return this._intro }
	get chapters() { return this._chapters };

	get _object() {
		const course = {
			title : this._title,
			intro : this._intro._object,
			chapters : this._chapters.map((chapter) => chapter._object),
		};
		return course;
	};
};



class CourseDataIntro {
	_id : string;
	_parts : CourseDataPart[];

	constructor(courseDataSectionObject:courseDataSectionObject) {
		const { _id,parts } = courseDataSectionObject;
		this._id = _id;
		this._parts = parts.map((part) => new CourseDataPart(part));;
	}

	get parts() { return this._parts };

	get _object() {
		const chapter = {
			_id : this._id,
			parts : this._parts.map((part) => part._object),
		};
		return chapter;
	};
}



class CourseDataChapter {
	#_id : string;
	#header : string;
	#intro : CourseDataSection|null;
	#sections : CourseDataSection[];

	constructor(courseDataChapterObject:courseDataChapterObject) {
		const { _id,header,intro,sections } = courseDataChapterObject;
		this.#_id = _id;
		this.#header = header;
		this.#intro = intro ? new CourseDataSection(intro) : null
		this.#sections = sections.map((part) => new CourseDataSection(part));;
	}

	get _id() { return this.#_id };
	get header() { return this.#header };
	get intro() { return this.#intro };
	get sections() { return this.#sections };

	get _object() {
		const chapter = {
			_id : this.#_id,
			header : this.#header,
			intro : this.#intro._object,
			sections : this.#sections.map((section) => section._object),
		};
		return chapter;
	};
}



class CourseDataSection {
	#_id : string;
	#header : string;
	#parts : CourseDataPart[];

	constructor(courseDataSectionObject:courseDataSectionObject) {
		const { _id,header,parts } = courseDataSectionObject;
		this.#_id = _id;
		this.#header = header;
		this.#parts = parts.map((part) => new CourseDataPart(part));;
	}

	get _id() { return this.#_id };
	get header() { return this.#header }
	get parts() { return this.#parts };

	get _object() {
		const chapter = {
			_id : this.#_id,
			header : this.#header,
			parts : this.#parts.map((part) => part._object),
		};
		return chapter;
	};
}



class CourseDataPart {
	#_id : string;
	#type : string;

	constructor(courseDataPartObject:courseDataPartObject) {
		const { _id,type } = courseDataPartObject;
		this.#_id = _id;
		this.#type = type;
	}

	get _id() { return this.#_id };
	get type() { return this.#type }

	get _object() {
		const part = {
			_id : this.#_id,
			type : this.#type,
		};
		return part;
	};
}



const emptyCourse = new CourseData({ title:"",intro:{ _id:"",header:"",parts:[] },chapters:[] });

export default CourseData;
export { CourseDataChapter,CourseDataIntro,CourseDataSection,CourseDataPart,emptyCourse }
