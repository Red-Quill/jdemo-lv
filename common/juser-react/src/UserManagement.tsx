import React,{ useState,useEffect } from 'react';
import Form,{ Input,Button } from 'jforms';
import noTranslate from './no-translate.js';
import JUserClient,{ User } from 'juser-client';
import useUser from './useUser.js';



// tasks:
// show current user info
// change name
// change email (verify email)
// change password or set password
// add google login or remove google login
type userManagementPt = {
	t?:Function;
	jUserClient:JUserClient;
};

const UserManagement = ({ t=noTranslate,jUserClient }:userManagementPt) => {
	const user = useUser(jUserClient);
	const [ changeName,setChangeName ] = useState(false);

	useEffect(() => {
		jUserClient.refreshUserSession();
	},[]);

	return (
		<div>
			<div>{t("Name")}</div><div>{user.name}</div>
			{changeName ?
				<ChangeName jUserClient={jUserClient} t={t} changed={() => setChangeName(false)}/>
				:
				// @ts-ignore
				<Button onClick={() => setChangeName(true)}>{t("change name")}</Button>
			}
			<div>{t("Email login")}</div>
			{user.email && user.passwordId ?
				<ChangeEmailLoginCredentials jUserClient={jUserClient} t={t} done={() => {}}/>
				:
				<AddEmailLogin jUserClient={jUserClient} t={t} done={() => {}}/>
			}
			<div>{t("Google login")}</div>
			{user.googleId ?
				<RemoveGoogleLogin jUserClient={jUserClient} t={t}/>
				:
				<AddGoogleLogin jUserClient={jUserClient} t={t}/>
			}
		</div>
	);
};

const ChangeName = ({ jUserClient,t,changed }:any) => {
	const [ name,setName ] = useState("");
	const [ nameError,setNameError ] = useState("");
	
	const handleSubmit = async() => {
		if(!name) return setNameError(t("Name is required"));
		try {
			await jUserClient.changeName(name);
		} catch(exception:any) {
			return setNameError(exception.message);
		}
		changed();
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Name")} name="name" content={name} error={nameError} onChange={setName} />
			<Button>{t("save")}</Button>
			{/* @ts-ignore */}
			<Button onClick={changed}>{t("discard_1")}</Button>
		</Form>
	);
};

const ChangeEmail = ({ jUserClient,t,changed }:any) => {
	const [ email,setEmail ] = useState("");
	const [ emailError,setEmailError ] = useState("");
	const [ isChanged,setIsChanged ] = useState(false);
	
	const handleSubmit = async() => {
		setEmailError("");
		if(!email) return setEmailError(t("email is required"));
		try {
			await jUserClient.changeEmail(email);
		} catch(exception:any) {
			return setEmailError(exception.message);
		}
		setIsChanged(true);
		//changed();
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Email")} name="email" content={email} error={emailError} onChange={setEmail} />
			{isChanged && <p>{t("Email verification link has been sent to your email address")}</p>}
			<Button>{t("save")}</Button>
			{/* @ts-ignore */}
			<Button onClick={changed}>{t("discard_1")}</Button>
		</Form>
	);
};

const ChangePassword = ({ jUserClient,t,changed }:any) => {
	const [ password,setPassword1 ] = useState("");
	const [ password2,setPassword2 ] = useState("");
	const [ passwordError,setPasswordError ] = useState("");
	
	const handleSubmit = async() => {
		setPasswordError(!password ? t("Password is required") : "");
		if(password) setPasswordError(!password2 ? t("Password check is required") : "");
		if(password && password2 && (password !== password2)) setPasswordError(t("Passwords don't match"));
		setPasswordError("");
		if(!password || !password2 || (password !== password2)) return;
		try {
			await jUserClient.changePassword(password);
		} catch(exception:any) {
			return setPasswordError(exception.message);
		}
		changed();
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Password")} name="password" content={password} type="password" onChange={setPassword1} />
			<Input label={t("Password")} name="password2" content={password2} error={passwordError} type="password" onChange={setPassword2} />
			<Button>{t("save")}</Button>
			{/* @ts-ignore */}
			<Button onClick={changed}>{t("discard_1")}</Button>
		</Form>
	);
};

const ChangeEmailLoginCredentials = ({ jUserClient,done,t }:any) => {
	const user = useUser(jUserClient);
	const [ changeEmail,setChangeEmail ] = useState(false);
	const [ changePassword,setChangePassword ] = useState(false);

	return (
		<>
			<div>{user.email}</div>
			{changeEmail ?
				<ChangeEmail jUserClient={jUserClient} t={t} changed={() => setChangeEmail(false)}/>
				:
				// @ts-ignore
				<Button onClick={() => setChangeEmail(true)}>{t("change email")}</Button>
			}
			{changePassword ?
				<ChangePassword jUserClient={jUserClient} t={t} changed={() => setChangePassword(false)}/>
				:
				// @ts-ignore
				<Button onClick={() => setChangePassword(true)}>{t("change password")}</Button>
			}
		</>
	);
};

const AddEmailLogin = ({ jUserClient,done,t }:any) => {
	const [ email,setEmail ] = useState("");
	const [ emailError,setEmailError ] = useState("");
	const [ password,setPassword1 ] = useState("");
	const [ password2,setPassword2 ] = useState("");
	const [ passwordError,setPasswordError ] = useState("");
	const [ error,setError ] = useState("");
	const [ isSet,setIsSet ] = useState(false);

	const handleSubmit = async() => {
		setEmailError("");
		setPasswordError("");
		if(!email) return setEmailError(t("email is required"));
		if(password) setPasswordError(!password2 ? t("Password check is required") : "");
		if(password && password2 && (password !== password2)) setPasswordError(t("Passwords don't match"));
		try {
			await jUserClient.addEmailLogin(email);
		} catch(exception:any) {
			setError(exception.message);
			return;
		}
		setIsSet(true);
		done();
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Input label={t("Email")} name="email" content={email} error={emailError} onChange={setEmail} />
			<Input label={t("Password")} name="password" content={password} type="password" onChange={setPassword1} />
			<Input label={t("Password")} name="password2" content={password2} error={passwordError} type="password" onChange={setPassword2} />
			{error && <div className="jform-error">{error}</div>}
			{isSet && <div>{t("Email verification link has been sent to your email address")}</div>}
			<Button>{t("save")}</Button>
			{/* @ts-ignore */}
			<Button onClick={done}>{t("discard_1")}</Button>
		</Form>
	);
};

const AddGoogleLogin = ({ jUserClient,t }:any) => {
	const [ error,setError ] = useState("");

	useEffect(() => {
		// @ts-ignore
		google.accounts.id.initialize({
			client_id : jUserClient.client_id,
			callback : ({ credential }:any) => addGoogleLogin(credential)
		});

		// @ts-ignore
		google.accounts.id.renderButton(
			document.getElementById("googleSignUpDiv"),
			{ theme:"outline",size:"large" },
		);
	},[]);

	const addGoogleLogin = async(credential:string) => {
		setError("");
		try {
			await jUserClient.addGoogleLogin(credential);
		} catch(exception:any) {
			setError(exception.message);
			return;
		}
	};

	return (
		<>
			<div>{t("add")}</div>
			<div id="googleSignUpDiv"/>
			{error && <div className="jform-error">{error}</div>}
		</>
	);
};

const RemoveGoogleLogin = ({ jUserClient,t }:any) => {
	const user = useUser(jUserClient);
	const [ error,setError ] = useState("");
	
	const removeGoogleLogin = async() => {
		setError("");
		try {
			await jUserClient.removeGoogleLogin();
		} catch(exception:any) {
			setError(exception.message);
			return;
		}
	};

	// @ts-ignore
	return (
		<>
			<div>{user.gmail}</div>
			{error && <div className="jform-error">{error}</div>}
			<Button onClick={removeGoogleLogin}>{t("remove")}</Button>
		</>
	);
};



export default UserManagement;
