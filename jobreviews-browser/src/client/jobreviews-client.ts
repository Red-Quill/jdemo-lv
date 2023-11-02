//import JCoursesClient from "jcourses-client";
import JHttpClient,{ JHttpAux } from "jhttp-client";
import NotificationService from "jnotifications";
import JUserClient,{ translations as userTranslations } from "juser-client";
import J18Next from "j18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import translations from "./translations";
import JobReviews from "./jobreviews";
import GoogleClient from "./google-client";

import { Amplify } from 'aws-amplify';



type JobReviewsClientConstructor = {
	apiPath:string;
	googleUsersId:string;
	googleMapsApiKey:string;
	reCaptchaId:string;
	cognito:any;
};

class JobReviewsClient {
	//_courses:JCoursesClient;
	_http:JHttpClient;
	_localization:J18Next;
	_notifications:NotificationService;
	_users:JUserClient;
	_jobReviews:JobReviews;
	_apiPath:string;
	_googleClient:GoogleClient;
	//_onGoogleApiLoadCallbacks:Set<()=>any>;
	//_googlePlacesService:google.maps.places.PlacesService;

	constructor({ apiPath,googleUsersId,googleMapsApiKey,reCaptchaId,cognito }:JobReviewsClientConstructor) {
		//this._onGoogleApiLoadCallbacks = new Set();
		//loadGoogleApi(this._doOnGoogleApiLoadCallbacks);
		this._googleClient = new GoogleClient(googleMapsApiKey);
		this._http = new JHttpClient();
		this._localization = new J18Next([userTranslations,translations],LanguageDetector);
		this._notifications = new NotificationService();
		this._users = new JUserClient(googleUsersId,reCaptchaId);
		this._jobReviews = new JobReviews(reCaptchaId,{ cognito });
		this._apiPath = apiPath;


		Amplify.configure({
			Auth: {
				region : cognito.REGION,
				userPoolId : cognito.USER_POOL_ID,
				userPoolWebClientId : cognito.USER_POOL_APP_CLIENT_ID
			}
		});
	}

	init = async () => {
		await this._localization.init({
			detection: { order:[ "localStorage","htmlTag" ] },
		});
		this._localization.setLanguage("fi"); //TMP
		this._notifications.init();
		this._http.init();
		this._users.init(this._http);
		await this._googleClient.init(this._localization);
		await this._jobReviews.init(this._http,this._googleClient,this._localization)
	};

	//onGoogleApiLoad = (callback:()=>any) => {
	//	googleApiStatus < 2 ? this._onGoogleApiLoadCallbacks.add(callback) : callback();
	//};

	/*
	_doOnGoogleApiLoadCallbacks = () => {
		this._googlePlacesService = new google.maps.places.PlacesService(document.createElement('div'));
		for(const callback of this._onGoogleApiLoadCallbacks) {
			callback();
		}
		this._onGoogleApiLoadCallbacks = new Set();
	}
	*/
	get jUserClient() {return this._users;}
	get localization() {return this._localization;}
	get notifications() {return this._notifications;}
	get jobReviews() {return this._jobReviews;}
	get googleClient() {return this._googleClient;}

	//get googleMapsApiIsLoaded() {return googleApiStatus >= 2;}
	//get googlePlacesService() {return this._googlePlacesService;}
}



export default JobReviewsClient;
export type { JobReviewsClient as JobWarningsClient };



/*

<script async
	src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap">
</script>

*/
