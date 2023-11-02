import React,{ useEffect,useState } from 'react';
import useUser from './useUser.js';
import type JUserClient from "juser-client";



type activatePT = {
	jUserClient:JUserClient;
	activationKey:string;
	translate?:Function;
};

const Activate = ({ jUserClient,activationKey,translate }:activatePT) => {
	const [ status,setStatus ] = useState(1);

	const activate = async() => {
		console.log("--> juser-react Activate activate");
		if(!activationKey) return setStatus(0);
		try {
			await jUserClient.activate(activationKey);
		} catch(exception:any) {
			setStatus(2);
			console.log("<-- juser-react Activate activate");
			return;
		}
		setStatus(3)
		console.log("<-- juser-react Activate activate");
	};

	useEffect(() => {activate()},[]);

	switch(status) {
		case 0: return <div>Activation key is invalid</div>;
		case 1: return <div>Verifying your account. Please wait...</div>;
		case 2: return <div>Account activation failed :(</div>;
		case 3: return <Activated jUserClient={jUserClient}/>;
	}
	return <div>Verifying your account. Please wait...</div>;
};

const Activated = ({ jUserClient }:any) => {
	const user = useUser(jUserClient);

	if(user._id) return <div>Your new account is now activated. You can now log in as the new user.</div>;
	return (
		<div>
			Your account is now activated. Go to the <a href="/app/login">login page</a> to log in as the new user.
		</div>
	);
};


export default Activate;
