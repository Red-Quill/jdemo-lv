import { Gmailer } from "jemailer";



type EmailerConstructor = {
	user:any;
}

class UserEmailSender {
	_emailer:Gmailer;
	_user:any;

	constructor({ user }:EmailerConstructor) {
		this._user = user;
	}

	init = async(emailer:Gmailer) => {
		this._emailer = emailer;
	};

	sendActivationLink = async(email:string,baseAddress:string,activationKey:string) => {
		const url = `${baseAddress}/app/activate?activationkey=${activationKey}`;
		const mailOptions = {
			from : this._user,
			to : email,
			subject : "Activate your account",
			html : `<p><a href="https://${url}">Click this link</a> to activate your account or copy this address to your browser: ${url}</p>`
		};
		await this._emailer.sendMail(mailOptions);
	};

	sendPasswordResetLink = async(email:string,baseAddress:string,resetKey:string) => {
		console.log("--> UserEmailSender sendPasswordResetLink");
		const url = `${baseAddress}/app/newpassword?resetkey=${resetKey}`;
		const mailOptions = {
			from : this._user,
			to : email,
			subject : "Reset your password",
			html : `<p><a href="https://${url}">Click this link</a> to reset your password or copy this address to your browser: ${url}</p>`
		};
		await this._emailer.sendMail(mailOptions);
		console.log("<-- UserEmailSender sendPasswordResetLink");
	};

	sendEmailVerification = async(email:string,baseAddress:string,verificationKey:string) => {
		const url = `${baseAddress}/app/verifyemail?verificationkey=${verificationKey}`;
		const mailOptions = {
			from : this._user,
			to : email,
			subject : "Verify your new email address",
			html : `<p><a href="https://${url}">Click this link</a> to vefiry your email address or copy this address to your browser: ${url}</p>`
		};
		await this._emailer.sendMail(mailOptions);
	};
}



export default UserEmailSender;
