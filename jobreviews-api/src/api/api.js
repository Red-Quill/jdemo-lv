import express from "express";
import { MainRouter } from "../jrouter/jrouter.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
//import compression from "compression.js";

import jobReviewsSearchReviews from "./jobreviews/search-reviews.js";
import jobReviewsSearchWorkplaces from "./jobreviews/search-workplaces.js"
import jobReviewsSearchWorkplaceReviews from "./jobreviews/search-workplacereviews.js"
import jobReviewsWorkplace from "./jobreviews/workplace.js";
import jobReviewsWorkplacestatistics from "./jobreviews/workplacestatistics.js";
import jobReviewsReview from "./jobreviews/review.js";
import jobReviewsMyreview from "./jobreviews/myreview.js";
import jobReviewsMyreviews from "./jobreviews/myreviews.js";
import jobReviewsAddReview from "./jobreviews/addreview.js";
import jobReviewsNewReview from "./jobreviews/newreview.js";
import jobReviewsReportReview from "./jobreviews/reportreview.js";

import userRegister from "./user/register.js";
import userActivate from "./user/activate.js";
import userGoogleRegister from "./user/googleRegister.js";
import userLogin from "./user/login.js";
import userGooglelogin from "./user/googleLogin.js";
import userCurrent from "./user/current.js";
import userRefresh from "./user/refresh.js";
import userLogout from "./user/logout.js";
import userResetPassword from "./user/resetPassword.js";
import userSetNewPassword from "./user/setNewPassword.js";
import userChangeName from "./user/changeName.js";
import userChangeEmail from "./user/changeEmail.js";
import userVerifyEmail from "./user/verifyEmail.js";
import userChangePassword from "./user/changePassword.js";
import userRemovePassword from "./user/removePassword.js";
import userAddGooleLogin from "./user/addGoogleLogin.js";
import userRemoveGooleLogin from "./user/removeGoogleLogin.js";
import health from "./health.js";
import notFound from "./notFound.js";
import errorHandler from "./errorHandler.js";



class Api {
	app;
	expressApp;

	constructor(logManager,userApi,jobReviewsApi) {
		this.app = new MainRouter();

		this.app.useWorker(helmet());
		// Compression FAILS
		//this.app.use(compression); // possibly disable in development
		//this.app.useWorker(cors({ exposedHeaders:"x-auth-token" }));
		this.app.useWorker(cookieParser());
		this.app.useWorker(express.json());
		this.app.useWorker(express.urlencoded({ extended:true }));
		
		this.app.useSubRouter("/api/jobreviews/search/reviews",jobReviewsSearchReviews(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/search/workplacereviews",jobReviewsSearchWorkplaceReviews(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/search/workplaces",jobReviewsSearchWorkplaces(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/workplace",jobReviewsWorkplace(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/workplacestatistics",jobReviewsWorkplacestatistics(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/review",jobReviewsReview(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/myreview",jobReviewsMyreview(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/addreview",jobReviewsAddReview(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/newreview",jobReviewsNewReview(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/myreviews",jobReviewsMyreviews(jobReviewsApi));
		this.app.useSubRouter("/api/jobreviews/reportreview",jobReviewsReportReview(jobReviewsApi));

		this.app.useSubRouter("/api/user/register",userRegister(userApi));
		this.app.useSubRouter("/api/user/activate",userActivate(userApi));
		this.app.useSubRouter("/api/user/googleregister",userGoogleRegister(userApi));
		// add google login (binding)
		// remove google login (binding)
		this.app.useSubRouter("/api/user/login",userLogin(userApi));
		this.app.useSubRouter("/api/user/googlelogin",userGooglelogin(userApi));
		this.app.useSubRouter("/api/user/current",userCurrent(userApi));
		this.app.useSubRouter("/api/user/refresh",userRefresh(userApi));
		this.app.useSubRouter("/api/user/logout",userLogout(userApi));
		this.app.useSubRouter("/api/user/resetpassword",userResetPassword(userApi));
		this.app.useSubRouter("/api/user/setnewpassword",userSetNewPassword(userApi));
		this.app.useSubRouter("/api/user/changename",userChangeName(userApi));
		this.app.useSubRouter("/api/user/changeemail",userChangeEmail(userApi));
		this.app.useSubRouter("/api/user/verifyemail",userVerifyEmail(userApi));
		this.app.useSubRouter("/api/user/changepassword",userChangePassword(userApi));
		this.app.useSubRouter("/api/user/removepassword",userRemovePassword(userApi));
		this.app.useSubRouter("/api/user/addgooglelogin",userAddGooleLogin(userApi));
		this.app.useSubRouter("/api/user/removegooglelogin",userRemoveGooleLogin(userApi));
		// change password (or add if not previously set)
		this.app.useSubRouter("/~health",health());
		this.app.setFinal(notFound);
		this.app.setErrorHandler(errorHandler(logManager));

		this.expressApp = this.app.getExpressMainRouter();
	};

	listener = (port) => {
		const listener = this.expressApp.listen(port);
		return listener
	};
};



export default Api;



/*
*/
