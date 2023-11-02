import React,{ useEffect,useState } from 'react';
import { wait } from "jutils";
import { matchExceptions } from 'jexception';
import { NoAccountWithGoogleIdException } from "juser";



type googleLoginPT = {
	googleLogin:Function;
	client_id:string;
};

const GoogleLogin = ({ googleLogin,client_id }:googleLoginPT) => {
	const [ googleLoginError,setGoogleLoginError ] = useState("");

	const _googleLogin = async(credential:any) => {	
		try {
			await googleLogin(credential)
		} catch(exception:any) {
			matchExceptions(exception,
				NoAccountWithGoogleIdException,()=>setGoogleLoginError("Tällä google-tunnuksella ei ole vielä rekisteröity tiliä. Luo tili täällä")
			)
		}
	}

	const initGoogle = async() => {
		// @ts-ignore -- hack to wait until google scripts initialize
		while(!google) await wait(1000);

		// @ts-ignore
		google.accounts.id.initialize({
			client_id,
			callback : ({ credential }:any) => _googleLogin(credential)
		});

		// @ts-ignore
		google.accounts.id.renderButton(
			document.getElementById("googleSignInDiv"),
			{ theme:"outline",size:"large" },
		);	
	};

	useEffect(() => {
		initGoogle();
	},[]);

	return (
		<>
			<div id="googleSignInDiv"/>
			{googleLoginError && <div>{googleLoginError}</div>}
		</>
	);
};



export default GoogleLogin;
