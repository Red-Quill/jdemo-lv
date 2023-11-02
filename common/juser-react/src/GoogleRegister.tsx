import React,{ useEffect } from 'react';
import { wait } from "jutils";



type googleRegisterPT = {
	googleRegister:Function;
	client_id:string;
};

const GoogleRegister = ({ googleRegister,client_id }:googleRegisterPT) => {

	const initGoogle = async() => {
		// @ts-ignore -- hack to wait until google scripts initialize
		while(!google) await wait(1000);

		// @ts-ignore
		google.accounts.id.initialize({
			client_id,
			callback : ({ credential }:any) => googleRegister(credential)
		});

		// @ts-ignore
		google.accounts.id.renderButton(
			document.getElementById("googleSignUpDiv"),
			{ theme:"outline",size:"large" },
		);	
	};

	useEffect(() => {
		initGoogle();
	},[]);	

	return (
		<div id="googleSignUpDiv"/>
	);
};



export default GoogleRegister;
