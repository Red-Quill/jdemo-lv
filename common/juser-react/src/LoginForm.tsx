import React,{ useState } from 'react';
import Form,{ Input,Button } from 'jforms';
import noTranslate from './no-translate.js';
import { matchExceptions } from 'jexception';
import { InvalidEmailOrPasswordException } from 'juser';



type loginFormPT = {
	login:Function;
	translate?:Function;
};

const LoginForm = ({ translate,login }:loginFormPT) => {
	const [ email,setEmail ] = useState("");
	const [ password,setPassword ] = useState("");
	const [ emailError,setEmailError ] = useState("");
	const [ passwordError,setPasswordError ] = useState("");
	const [ loginError,setLoginError ] = useState("");

	const t = translate || noTranslate;

	const handleSubmit = async() => {
		setEmailError(!email ? t("Email is required") : "");
		setPasswordError(!password ? t("Password is required") : "");
		setLoginError("");
		if(!email || !password) return;
		try {
			await login({ email,password });
		} catch(exception:any) {
			matchExceptions(exception,
				InvalidEmailOrPasswordException,() => {setLoginError(t("Invalid email or password"))},
				() => {
					console.log(exception);
					setLoginError(t(exception.message));
				}
			);
		}
		// Parent component will redirect to /courses automatically when user logs in succesfully
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Email")} name="email" content={email} error={emailError} onChange={setEmail} />
			<Input label={t("Password")} name="password" content={password} error={passwordError} type="password" onChange={setPassword} />
			{loginError && <div className="jform-error">{loginError}</div>}
			<Button>{t("Sign in")}</Button>
		</Form>
	);
};



export default LoginForm;
