import React from "react";



type SelectionsPT = {
	children?:any;
	[key:string]:any;
};

const Selections = ({ children }:SelectionsPT) => (
	<div className="jform-selections">
		{children}
	</div>
);



export default Selections;
