import React,{ useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha"
import Form,{ Input,Button } from 'jforms';
import noTranslate from './no-translate.js';



type registerFormPt = {
	register:Function;
	translate?:Function;
	reCaptchaId:string;
};

const RegisterForm = ({ translate:t=noTranslate,register,reCaptchaId }:registerFormPt) => {
	const [ email,setEmail ] = useState("");
	const [ name,setName ] = useState("");
	const [ password,setPassword1 ] = useState("");
	const [ password2,setPassword2 ] = useState("");
	const [ reCaptcha,setReCaptcha ] = useState(null);
	const [ registerError,setRegisterError ] = useState("");
	const [ emailError,setEmailError ] = useState("");
	const [ nameError,setNameError ] = useState("");
	const [ reCaptchaError,setReCaptchaError ] = useState("");
	const [ passwordError,setPasswordError ] = useState("");

	const onReCaptchaChance = (value:any) => {
		setReCaptcha(value);
	}

	const handleSubmit = async() => {
		// The form only checks that field are non-empty
		// server and client take responsibility of validation
		setEmailError(!email ? t("Email is required") : "");
		setNameError(!name ? t("Name is required") : "");
		setPasswordError(!password ? t("Password is required") : "");
		if(password) setPasswordError(!password2 ? t("Password check is required") : "");
		if(password && password2 && (password !== password2)) setPasswordError(t("Passwords don't match"));
		setReCaptchaError(!reCaptcha ? t("Please, verify that you are not a robot") : "");
		setRegisterError("");
		if(!email || !name || !password || !password2 || (password !== password2) || !reCaptcha) return;
		try {
			await register({ email,name,password,reCaptcha });
		} catch(error:any) {
			setRegisterError(error.response.data.message);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Email")} name="email" content={email} error={emailError} onChange={setEmail} />
			<Input label={t("Name")} name="name" content={name} error={nameError} onChange={setName} />
			<Input label={t("Password")} name="password" content={password} type="password" onChange={setPassword1} />
			<Input label={t("Password")} name="password2" content={password2} error={passwordError} type="password" onChange={setPassword2} />
			<ReCAPTCHA onChange={onReCaptchaChance} sitekey={reCaptchaId}/>
			{reCaptchaError && <div className="jform-error">{reCaptchaError}</div>}
			{registerError && <div className="jform-error">{registerError}</div>}
			<Button>{t("Register")}</Button>
		</Form>
	);
};



export default RegisterForm;
