import React from "react";



type SuggestionsPT = {
	children?:any;
	[key:string]:any;
};

const Suggestions = ({ children }:SuggestionsPT) => (
	<div className="jform-suggestions">
		{children}
	</div>
);



export default Suggestions;
