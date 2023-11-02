import React,{ useEffect,useState } from 'react';
import RegisterForm from './RegisterForm.js';
import useUser from './useUser.js';
import TermsConditionsPrivacyPolicy from './TermsConditionsPrivacyPolicy.js';
import GoogleRegister from './GoogleRegister.js';
import type JUserClient from "juser-client";



type registerPT = {
	jUserClient:JUserClient;
	onSuccess:Function;
	terms?:any;
	translate?:Function;
};

const Register = ({ jUserClient,terms,onSuccess,translate }:registerPT) => {
	const user = useUser(jUserClient);
	const [ registered,setRegistered ] = useState(false);
	const [ termsAccepted,setTermsAccepted ] = useState("");

	// page shouldn't open if user is logged in
	useEffect(() => {user._id && onSuccess()},[ user ]);

	const register = async(data:Object) => {
		if(terms && !termsAccepted) return;
		// @ts-ignore
		await jUserClient.register({ ...data,termsAccepted });
		setRegistered(true);
	};

	const googleRegister = async(token:string) => {
		if(terms && !termsAccepted) return;
		// @ts-ignore
		await jUserClient.googleRegister({ token,termsAccepted });
	};

	if(user._id) return <div>User is already logged in :D</div>;
	if(registered) return <div>User is registered. You should receive an activation link to your inbox shortly.</div>;
	return (
		<>
			{terms && <TermsConditionsPrivacyPolicy onChange={setTermsAccepted} terms={terms} t={translate}/>}
			<RegisterForm translate={translate} register={register} reCaptchaId={jUserClient.reCaptchaId} />
			<GoogleRegister
				googleRegister={googleRegister}
				client_id={jUserClient.client_id}
			/>
		</>
	);
};



export default Register;
