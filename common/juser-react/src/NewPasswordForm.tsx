import React,{ useState } from 'react';
import Form,{ Input,Button } from 'jforms';
import noTranslate from './no-translate.js';



type newPasswordFormPt = {
	resetKey:string;
	setNewPassword:Function;
	onReset:Function;
	translate?:Function;
};

const NewPasswordForm = ({ resetKey,translate,setNewPassword,onReset }:newPasswordFormPt) => {
	const [ password,setPassword1 ] = useState("");
	const [ password2,setPassword2 ] = useState("");
	const [ registerError,setRegisterError ] = useState("");
	const [ passwordError,setPasswordError ] = useState("");

	const t = translate || noTranslate;

	const handleSubmit = async() => {
		// The form only checks that field are non-empty
		// server and client take responsibility of validation
		setPasswordError(!password ? t("Password is required") : "");
		if(password) setPasswordError(!password2 ? t("Password check is required") : "");
		if(password && password2 && (password !== password2)) setPasswordError(t("Passwords don't match"));
		setRegisterError("");
		if(!password || !password2 || (password !== password2)) return;

		console.log("OK, lähetetään")
		const { error } = await setNewPassword({ resetKey,password });
		if(error) return setRegisterError(error.response.data);
		onReset();
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Password")} name="password" content={password} type="password" onChange={setPassword1} />
			<Input label={t("Password")} name="password2" content={password} error={passwordError} type="password" onChange={setPassword2} />
			{registerError && <div className="jform-error">{registerError}</div>}
			<Button>{t("set new password")}</Button>
		</Form>
	);
};



export default NewPasswordForm;
