import React,{ useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha"
import Form,{ Input,Button } from 'jforms';
import noTranslate from './no-translate.js';



type resetPasswordFormPt = {
	resetPassword:Function;
	onReset:Function;
	translate?:Function;
	reCaptchaId:string;
};

const ResetPasswordForm = ({ translate,resetPassword,onReset,reCaptchaId }:resetPasswordFormPt) => {
	const [ email,setEmail ] = useState("");
	const [ reCaptcha,setReCaptcha ] = useState(null);
	const [ emailError,setEmailError ] = useState("");
	const [ registerError,setRegisterError ] = useState("");
	const [ reCaptchaError,setReCaptchaError ] = useState("");

	const t = translate || noTranslate;

	const onReCaptchaChance = (value:any) => {
		setReCaptcha(value);
	}

	const handleSubmit = async() => {
		// The form only checks that field are non-empty
		// server and client take responsibility of validation
		setEmailError(!email ? t("Email is required") : "");
		setReCaptchaError(!reCaptcha ? t("Please, verify that you are not a robot") : "");
		setRegisterError("");
		if(!email || !reCaptcha) return;

		const { error } = await resetPassword({ email,reCaptcha });
		if(error) return setRegisterError(error.response.data);
		onReset();
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Email")} name="email" content={email} error={emailError} onChange={setEmail} />
			<ReCAPTCHA onChange={onReCaptchaChance} sitekey={reCaptchaId}/>
			{reCaptchaError && <div className="jform-error">{reCaptchaError}</div>}
			{registerError && <div className="jform-error">{registerError}</div>}
			<Button>{t("Reset password")}</Button>
		</Form>
	);
};



export default ResetPasswordForm;
