import React,{ useEffect,useState } from 'react';
import useUser from './useUser.js';
import ResetPasswordForm from './ResetPasswordForm.js';
import type JUserClient from "juser-client";



type resetPasswordPT = {
	jUserClient:JUserClient;
	translate?:Function;
	onSuccess:Function;
};

const ResetPassword = ({ jUserClient,onSuccess,translate }:resetPasswordPT) => {
	const user = useUser(jUserClient);
	const [ reset,setReset ] = useState(false);

	useEffect(() => {user._id && onSuccess()},[ user ]);

	if(user._id) return <p>User is already logged in :D</p>;
	if(reset) return <Reset />;
	return <ResetPasswordForm translate={translate} resetPassword={jUserClient.resetPassword} onReset={() => setReset(true)} reCaptchaId={jUserClient.reCaptchaId} />;
};

const Reset = () => (
	<div>Password reset link has been sent to your email address.</div>
);



export default ResetPassword;
