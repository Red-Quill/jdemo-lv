import React,{ ReactNode,ReactElement } from 'react';



type FormPT = {
	children:any;
	onSubmit:Function;
};

const Form = ({ children,onSubmit }:FormPT) => {

	const handleSubmit = async(event:any) => {
		event.preventDefault();
		onSubmit();
	};

	return (
		<form className="jform" onSubmit={handleSubmit}>
			{children}
		</form>
	);
};



export default Form;
