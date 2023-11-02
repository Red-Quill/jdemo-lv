import React,{ useEffect,useState } from 'react';
import useUser from './useUser.js';
import type JUserClient from "juser-client";
import NewPasswordForm from './NewPasswordForm.js';



type newPasswordPT = {
	jUserClient:JUserClient;
	resetKey:string;
	translate?:Function;
};

const NewPassword = ({ jUserClient,resetKey,translate }:newPasswordPT) => {
	const [ status,setStatus ] = useState(1);

	useEffect(() => {
		if(!resetKey) setStatus(0);
	},[]);

	switch(status) {
		case 0: return <div>Activation key is invalid</div>;
		case 2: return <Reset jUserClient={jUserClient}/>;
	}
	return <NewPasswordForm resetKey={resetKey} setNewPassword={jUserClient.setNewPassword} translate={translate} onReset={() => setStatus(2)} />;
};

const Reset = ({ jUserClient }:any) => {
	const user = useUser(jUserClient);

	if(user._id) return <div>Password reset was successful. You can now log in with your new password.</div>;
	return (
		<div>
			Password reset was successful. Go to the <a href="/app/login">login page</a> to log in with your new password.
		</div>
	);
};


export default NewPassword;
