import React from "react";



type SelectionPT = {
	value:string;
	item:any;
	onRemove:Function;
};

const Selection = ({ value,item,onRemove }:SelectionPT) => (
	<div className="jform-selection">
		{value}
		<span onClick={() => onRemove(item)}> {x}</span>
	</div>
);

const x = <svg style={{ height:"1rem",verticalAlign:"middle" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M32,4A28,28,0,1,0,60,32,28,28,0,0,0,32,4ZM43.31,37.66a4,4,0,0,1-5.66,5.66L32,37.66l-5.66,5.66a4,4,0,0,1-5.66-5.66L26.34,32l-5.66-5.66a4,4,0,0,1,5.66-5.66L32,26.34l5.66-5.66a4,4,0,0,1,5.66,5.66L37.66,32Z"/></svg>



export default Selection;


