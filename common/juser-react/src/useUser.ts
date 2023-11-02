import React,{ useEffect,useState } from 'react';
import type JUserClient from "juser-client";
import type { User } from "juser-client";



const useUser = (jUserClient:JUserClient) => {
	if(!jUserClient) throw new Error("Shit1")
	if(!jUserClient.user) throw new Error("Shit2")
	if(jUserClient.user._id == undefined) throw new Error("Shit3")
	console.log("moro",jUserClient)
	const [ user,setUser ] = useState<User>(jUserClient.user);

	useEffect(() => {
		jUserClient.onUserChanged(setUser);
		return () => {jUserClient.offUserChanged(setUser)};
	},[]);

	console.log("Hello",user)
	return user;
};



export default useUser;
