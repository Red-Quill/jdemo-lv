import nodemailer from "nodemailer";
import type { Transporter,SendMailOptions } from "nodemailer";
import { google } from "googleapis";
import Emailer from "./emailer";



const OAuth2 = google.auth.OAuth2;

type GmailerConstructor = {
	service:string;
	user:any;
	clientId:any;
	clientSecret:any;
	refreshToken:any;
	authType:any;	
}

class Gmailer extends Emailer{
	_mailer:Transporter;
	_service:string;
	_user:any;
	_clientId:any;
	_clientSecret:any;
	_refreshToken:any;
	_authType:any;

	constructor({ service,user,clientId,clientSecret,refreshToken,authType }:GmailerConstructor) {
		super();
		this._service = service;
		this._user = user;
		this._clientId = clientId;
		this._clientSecret = clientSecret;
		this._refreshToken = refreshToken;
		this._authType = authType;
	}

	init = async() => {
		const oauth2Client = new OAuth2(
			this._clientId,
			this._clientSecret,
			"https://developers.google.com/oauthplayground"
		);
		oauth2Client.setCredentials({ refresh_token:this._refreshToken });
		const accessToken = await new Promise((resolve, reject) => {
			oauth2Client.getAccessToken((error,token) => {
				if(error) {
					console.log("*ERR: ", error)
					reject();
				}
				resolve(token);
			});
		});

		this._mailer = nodemailer.createTransport({
			// @ts-ignore
			service : this._service,
			auth : {
				type : this._authType,
				user : this._user,
				accessToken,
				clientId: this._clientId,
				clientSecret: this._clientSecret,
				refreshToken: this._refreshToken,
			},
		});
	};

	sendMail = (mailOptions:SendMailOptions) => {
		return new Promise((resolve:any,reject:any) => {
			this._mailer.sendMail(mailOptions,(error:any,info:any) => {
				error ? reject(error) : resolve(info);
			});
		});
	};
}



export default Gmailer;


/*

	sendActivationLink = async(email:string,baseAddress:string,activationKey:string) => {
		const url = `${baseAddress}/app/activate?activationkey=${activationKey}`;
		const mailOptions = {
			from : this._user,
			to : email,
			subject : "Activate your account",
			html : `<p><a href="https://${url}">Click this link</a> to activate your account or copy this address to your browser: ${url}</p>`
		};
		this._mailer.sendMail(mailOptions,(error:any,info:string) => {
			if(error) console.log(error);
		});
	};

	sendPasswordResetLink = async(email:string,baseAddress:string,resetKey:string) => {
		const url = `${baseAddress}/app/newpassword?resetkey=${resetKey}`;
		const mailOptions = {
			from : this._user,
			to : email,
			subject : "Reset your password",
			html : `<p><a href="https://${url}">Click this link</a> to reset your password or copy this address to your browser: ${url}</p>`
		};
		this._mailer.sendMail(mailOptions,(error:any,info:string) => {
			if(error) console.log(error);
		});
	};

	sendEmailVerification = async(email:string,baseAddress:string,verificationKey:string) => {
		const url = `${baseAddress}/app/verifyemail?verificationkey=${verificationKey}`;
		const mailOptions = {
			from : this._user,
			to : email,
			subject : "Verify your new email address",
			html : `<p><a href="https://${url}">Click this link</a> to vefiry your email address or copy this address to your browser: ${url}</p>`
		};
		this._mailer.sendMail(mailOptions,(error:any,info:string) => {
			if(error) console.log(error);
		});
	};

*/