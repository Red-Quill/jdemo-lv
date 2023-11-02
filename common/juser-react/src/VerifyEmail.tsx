import React,{ useEffect,useState } from 'react';
import type JUserClient from "juser-client";
import useUser from './useUser.js';



type verifyEmailPT = {
	jUserClient:JUserClient;
	verificationKey:string;
	translate?:Function;
};

const VerifyEmail = ({ jUserClient,verificationKey,translate }:verifyEmailPT) => {
	const user = useUser(jUserClient);
	const [ status,setStatus ] = useState(1);

	const verify = async() => {
		if(!user._id) setStatus(4);
		if(!verificationKey) return setStatus(0);
		try {
			await jUserClient.verifyEmail(verificationKey);
		} catch(exception:any) {
			setStatus(2);
		}
		setStatus(3);
	};

	useEffect(() => {verify()},[]);

	switch(status) {
		case 0: return <div>Verification link (key) is invalid</div>;
		case 1: return <div>Verifying your email. Please wait...</div>;
		case 2: return <div>Email verification failed :(</div>;
		case 3: return <div>Email verification was succesfull :)</div>;
		case 4: return <div>You are not logged in. Log in as a user whose email is being changed.</div>;
	}
	return <div>Verifying your account. Please wait...</div>;
};



export default VerifyEmail;
