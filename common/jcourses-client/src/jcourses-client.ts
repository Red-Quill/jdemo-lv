//import { User } from "juser";
import { Course,CourseData,CourseDataPart,CoursePartExercise,CoursePartTheory,noCourse } from "jcourses";
import { wait } from "jutils";
import type { JHttp } from "jhttp-client";
import type NotificationService from "jnotifications";
//import type UserService from "./userService";



// courses and userCourses use _id (mongo id)
// courseData and courseItems use courseId --- own id convention

// !!!Current implementation can cause memory leak
class JCoursesClient {
	_httpService:JHttp;
	_notificationService:NotificationService;
	//_userService:UserService;

	_updateInterval:number;
	_lastUpdated:number; // local time point
	//_coursesLastUpdated:number; // server time point
	_courses:{ [key:string]:Course };
	//_userCourses:Map<string,Course>;

	_courseData:{ [key:string]:CourseData };
	_courseExercises:{ [key:string]:CoursePartExercise };
	_courseTheories:{ [key:string]:CoursePartTheory };

	constructor() {
		this._courses = {};
		//this._userCourses = new Map();
		this._courseData = {};
		this._courseExercises = {};
		this._courseTheories = {};
	}

	//init = (httpService:HttpService,userService:UserService) => {
	init = async(httpService:JHttp,notificationService:NotificationService) => {
		this._updateInterval = 600_000;
		this._lastUpdated = 0; // local time point
		//this._coursesLastUpdated = 0; // server time point
		this._httpService = httpService;
		this._notificationService = notificationService;
		//this._userService = userService;
		//this._userService.onUserChanged((user:User) => this.updateUserCourses())
	};

	_updateLoop = async() => {
		while (true) {
			try {
				const response = await this._httpService.get("catalog");
				await wait(this._updateInterval);
			} catch(error:any) {
				await wait(60_000)
			}
		}
	}

	maybeUpdate = async() => {
		if(Date.now() - this._lastUpdated > this._updateInterval) {
			await this.update();
		}
	}

	update = async() => {
		//const [ response,error ] = await this._httpService.get("lastupdated");
		//if(!response) {
		//	this._notificationService.showNotification("Couldn't update courses. Internet connection or server is unavailable.")
		//	return;
		//}
		//if(error) throw error;
		// @ts-ignore
		//const coursesLastUpdated = response.data;
		//if(this._coursesLastUpdated >= coursesLastUpdated) {
		//	this._lastUpdated = Date.now();
		//	return; // no need to update
		//}

		try {
			const response = await this._httpService.get("catalog");
			// @ts-ignore
			for (const course of response.data) {
				this._courses[course._id] = new Course(course);
			}
			//this._coursesLastUpdated = coursesLastUpdated;
			this._lastUpdated = Date.now();		
		} catch(error:any) {
			this._notificationService.showNotification(error.message);
			// maybe throw error
		}
	};

	/*
	updateUserCourses = async() => {
		await this.maybeUpdate();
		const sessionToken = this._userService.sessionToken;
		if(!sessionToken) {
			this.clearUserCourses();
			throw new Error("No user logged in");
		};
		// @ts-ignore
		let data;
		try {
			const _res = await this._httpService.get("/my");
			data = _res && _res.data;
		} catch(error) {return}
		this.clearUserCourses();
		for (const course_id of data) {
			// @ts-ignore
			this._userCourses.set(course_id,this._courses.get(course_id));
		}
	}

	clearUserCourses = () => {
		this._userCourses.clear();
	}
	*/

	// --> Getting course thumbnails
	getCourseCatalog = async() => {
		await this.maybeUpdate();
		return Object.values(this._courses);
	};

	/*
	getUserCourses = async() => {
		//console.log("getUserCourses")
		await this.updateUserCourses();
		return this._userCourses;
	}
	*/

	getCourse = async(courseId:string) => {
		if(!courseId) return noCourse;
		await this.maybeUpdate();
		return this._courses[courseId]
	}
	// <-- Getting course thumbnails

	// --> 
	// courseData and courseItems use courseId --- own id convention
	getCourseData = async(course:Course) => {
		//if(!this._userService.sessionToken) throw new Error("No user logged in");
		const { _id } = course;
		if(!(_id in this._courseData))
			await this._fetchAndCacheCourseData(_id)
		return this._courseData[_id];
	}

	_fetchAndCacheCourseData = async(courseId:string) => {
		//console.log("_fetchAndCacheCourseData");
		// @ts-ignore
		const response = await this._httpService.get(`assets/${courseId}/${courseId}.json`);
		// @ts-ignore
		this._courseData[courseId] = new CourseData(response.data);
	};

	getCourseExercise = async(course:Course,item:CourseDataPart) => {
		//if(!this._userService.sessionToken) throw new Error("No user logged in");
		const { _id } = item // _id could be renamed to itemId
		// @ts-ignore
		if(!(_id in this._courseExercises))
			await this._fetchAndCacheCourseExercise(course._id,_id);
		return this._courseExercises[_id];
	}

	_fetchAndCacheCourseExercise = async(courseId:string,itemId:string) => {
		//console.log("_fetchAndCacheCourseItem",itemId)
		// @ts-ignore
		const response = await this._httpService.get(`assets/${courseId}/${itemId}.json`);
		// @ts-ignore
		this._courseExercises[itemId] = new CoursePartExercise(response.data);
	};

	getCourseTheory = async(course:Course,item:CourseDataPart) => {
		//if(!this._userService.sessionToken) throw new Error("No user logged in");
		const { _id } = item // _id could be renamed to itemId
		// @ts-ignore
		if(!(_id in this._courseTheories))
			await this._fetchAndCacheCourseTheory(course._id,_id)
		return this._courseTheories[_id];
	}

	_fetchAndCacheCourseTheory = async(courseId:string,itemId:string) => {
		//console.log("_fetchAndCacheCourseItem",itemId)
		// @ts-ignore
		const response = await this._httpService.get(`assets/${courseId}/${itemId}.json`);
		// @ts-ignore
		this._courseTheories[itemId] = new CoursePartTheory(response.data);;
	};
	// <--


	/*
	// now course = course._id
	// communicate with userService or something that caches user specific stuff
	addCourseToUser = async(course:Course) => {
		const sessionToken = this._userService.sessionToken;
		if(!sessionToken) throw new Error("No user logged in");
		// @ts-ignore
		await this._httpService.put("/my/add",{ courseId:course._id },{ headers:{ "x-auth-token":sessionToken } });
		await this.updateUserCourses();
	};

	isMine = (course:Course) => this._userCourses.has(course._id);
	*/
};



export default JCoursesClient;
