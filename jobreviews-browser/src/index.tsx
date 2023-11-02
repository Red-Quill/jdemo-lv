import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';

import App from "./app/App";
import JobReviewsClient from './client/jobreviews-client';


// These are not real api keys
const googleMapsApiKey = "AIzaSxAwlvU8ztQrIhz4uhvZJtQoGmM9au1Twi0";
const googleUsersId = "416363859578-1aukb5ddn3t010sfrtfo0qqpu17abvu5";
const reCaptchaId = "6LfcFy8oAAAAAICFczRlCHVfVEjqBu-1-sCrbUZl";

const cognito = {
	"REGION" : "us-east-1",
	"USER_POOL_ID" : "us-east-1_6hnCoETSN",
	"USER_POOL_APP_CLIENT_ID" : "8jcu4hdajbkr5g2di6ktebk6bd"
};

const jobWarningsClient = new JobReviewsClient({
	apiPath : "api",
	googleUsersId,
	googleMapsApiKey,
	reCaptchaId,
	cognito,
});
jobWarningsClient.init();

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<App jobWarningsClient={jobWarningsClient}/>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
