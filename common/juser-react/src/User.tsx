import React,{ useEffect,useState } from 'react';
import LoginForm from './LoginForm.js';
import useUser from './useUser.js';
import type JUserClient from "juser-client";
import GoogleLogin from './GoogleLogin.js';



const useComponent = (InitialComponent:any) => {
	const [ Component,_setComponent ] = useState(() => InitialComponent);

	const setComponent = (Component:any) => _setComponent(() => Component);

	return [ Component,setComponent ]
}

type userPT = {
	jUserClient:JUserClient;
	layoutStyle:string;
	InitialComponent:any;
};

const User = ({ jUserClient,layoutStyle,InitialComponent }:userPT) => {
	const [ Render,setRender ] = useComponent(InitialComponent);

	return (
		<div className={`juser juser-${layoutStyle}`}>
			<Render layoutStyle={layoutStyle} jUserClient={jUserClient} />
		</div>
	);
};



export default User;
