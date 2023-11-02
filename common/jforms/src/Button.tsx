import React from 'react';



type ButtonPT = {
	children:any;
	[key:string]:any;
};

const Button = ({ children,...rest }:ButtonPT) => (
	<button className="jform-button" {...rest}>{children}</button>
);



export default Button;
