import React from "react";



type SuggestionPT = {
	value:string;
	item:any;
	onSelect:Function;
};

const Suggestion = ({ value,item,onSelect }:SuggestionPT) => (
	<div className="jform-suggestion" onClick={() => onSelect(item)}>
		{value}
	</div>
);



export default Suggestion;
