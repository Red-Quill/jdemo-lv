import React from "react";



type TextAreaPT = {
	name:string;
	label?:string;
	onChange:any;
	error?:string;
	[key:string]:any;
};

const TextArea = ({ name,label,onChange,error,...rest }:TextAreaPT) => (
	<div className="jform-field">
		<label className="jform-label" htmlFor={name}>{label || name}</label>
		<textarea
			className="jform-textarea"
			name={name}
			onChange={ ({ currentTarget:input }) => onChange(input.value) }
			{...rest}
		/>
		{error && <div className="jform-error">{error}</div>}
	</div>
);



export default TextArea;
