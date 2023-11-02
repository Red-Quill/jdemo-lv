import { wait } from "jutils";
import { Course } from "jcourses";
import FileManager from "jfiles";



class CourseManager {
	//dataBaseManager;
	//#logManager;
	courseFilesPath;
	_fileManager;
	_courses;
	_coursesLastUpdated;
	_courseItems;

	userCourseListSchema = {
		userId : { type:String,required:true,unique:true },
		courseIds : [ String ],
	};

	constructor({ courseFilesPath }) {
		this._courses = {};
		this._courseItems = {};
		this._coursesLastUpdated = 0;
		this.courseFilesPath = courseFilesPath;
		this._fileManager = new FileManager(courseFilesPath);
		console.log(`courseFilesPath: ${courseFilesPath}`)
	}

	init = async(dataBaseManager) => {
		//this.dataBaseManager = dataBaseManager;
		//await this.dataBaseManager.newTable("userCourseList",this.userCourseListSchema);
		//this.#logManager = logManager;
		await this.updateCourses();
		this._updateLoop();
	};

	_updateLoop = async() => {
		while (true) {
			try {
				await wait(1_800_000);
				await this.updateCourses();
			} catch (error) {
				console.warn("Updating courses failed.");
				//this.#logManager.logError(error);
				await wait(60_000);
			}
		};
	};

	updateCourses = async() => {
		const { lastUpdated,catalog } = await this._fileManager.readJSON("courses.json");
		if(this._coursesLastUpdated === lastUpdated) return;
		for(const course_ of catalog) {
			const courseItems = await this._fileManager.readJSON(`${course_.courseId}-items.json`);
			const course = new Course(course_);
			this._courses[course._id] = course;
			this._courseItems[course._id] = new Set(courseItems);
		}
		this._coursesLastUpdated = lastUpdated;
	};

	coursesLastUpdated = () => this._coursesLastUpdated;

	getCourses = async() => {
		console.log("getcourses",this._coursesLastUpdated)
		return Object.values(this._courses);
	};

	getCourse = async(courseId) => {
		const course = this._courses[courseId];
		// if !course throw error
		return course;
	};

	getCourseAsset = async(user,courseId,assetName) => {
		//console.log("getting",assetName);
		//const userCourseList = await this.dataBaseManager.findOneObject("userCourseList",{ userId:user._id });
		//if(!userCourseList.courseIds.includes(courseId)) return { error:"You don't have access to that course" };
		if(!(courseId in this._courseItems)) return { error:`There is no course ${courseId}` };
		if(!this._courseItems[courseId].has(assetName)) return { error:`The asset ${assetName} doesn't exist in course ${courseId}` }
		const assetFilePath = this._fileManager.fullPath(`${assetName}`);
		return { assetFilePath };
	}
	
	/*
	addCourseToUser = async(course,user) => {
		//console.log("CourseManager.addCourseToUser")
		const { error } = await this.dataBaseManager.updateOne("userCourseList",{ userId: user._id },
			{ $addToSet: { courseIds: course._id } },
			{ userId: user._id,courseIds: [] }
		);
		if(error) return { error };
		return { success:true };
	};

	getUserCourseList = async(user) => {
		const result = await this.dataBaseManager.findOneObject("userCourseList",{ userId: user._id });
		const courseList = result ? result.courseIds : [];
		return courseList;
	};
	*/
};



export default CourseManager;



/*
63c7482dd9d10a3a0fbc5e08.png - iconFileName

*/
