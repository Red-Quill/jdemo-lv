import React,{ useEffect } from 'react';
import { Button } from "jforms";
import LoginForm from './LoginForm.js';
import useUser from './useUser.js';
import type JUserClient from "juser-client";
import GoogleLogin from './GoogleLogin.js';



type loginPT = {
	jUserClient:JUserClient;
	onSuccess:Function;
	translate?:Function;
	onForgottenPassword:()=>void;
};

const Login = ({ jUserClient,onSuccess,translate,onForgottenPassword }:loginPT) => {
	const user = useUser(jUserClient);

	useEffect(() => {user._id && onSuccess()},[ user ]);

	return user._id ?
		<p>User is already logged in :D</p>
		:
		<>
			<LoginForm translate={translate} login={jUserClient.login} />
			<GoogleLogin
				googleLogin={jUserClient.googleLogin}
				client_id={jUserClient.client_id}
			/>
			{/* @ts-ignore */}
			<Button onClick={onForgottenPassword}>{translate("Forgotten password")}?</Button>
		</>
};



export default Login;
