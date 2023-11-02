import JCoursesClient from "jcourses-client";
import JHttpClient,{ JHttpAux } from "jhttp-client";
import NotificationService from "jnotifications";
import JUserClient from "juser-client";
import J18Next from "j18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import translations from "./translations";
import type { User } from "juser";



class JCourses {
	_courses:JCoursesClient;
	_http:JHttpClient;
	_localization:J18Next;
	_notifications:NotificationService;
	_users:JUserClient;
	_apiPath:string;

	get courses() { return this._courses }
	get notifications() { return this._notifications }

	constructor(apiPath:string,googleClientId:string) {
		this._courses = new JCoursesClient();
		this._http = new JHttpClient();
		this._localization = new J18Next(translations, LanguageDetector);
		this._notifications = new NotificationService();
		this._users = new JUserClient(googleClientId);
		this._apiPath = apiPath;
	}

	init = async () => {
		await this._localization.init({
			detection: { order:[ "localStorage","htmlTag" ] },
		});
		this._localization.setLanguage("fi"); //TMP
		this._notifications.init();
		this._http.init();
		this._users.init(this._http);
		//this.#courses.init(this.#http,this.#users);
		const coursesHttp = new JHttpAux(this._http,`${this._apiPath}/courses`);
		this._courses.init(coursesHttp, this._notifications);
	};

	get user():User { return this._users.user }
	get language() { return this._localization.language }
	get languages() { return this._localization.languages }
	get jUserClient() { return this._users }
	get localization() { return this._localization }
	get jCoursesClient() { return this._courses }

	setLanguage = (language:string) => this._localization.setLanguage(language);
	onLanguageChanged = (callback:any) => this._localization.onLanguageChanged(callback);
	offLanguageChanged = (callback:any) => this._localization.offLanguageChanged(callback);
	translate = (text:string) => this._localization.translate(text);
}



export default JCourses;
export type { JCoursesClient as CourseService };
