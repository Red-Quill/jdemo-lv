import React from "react";



type inputPT = {
	name:string;
	label?:string;
	onChange:any;
	error?:string;
	[key:string]:any;
};

const Input = ({ name,label,onChange,error,...rest }:inputPT) => (
	<div className="jform-field">
		<label className="jform-label" htmlFor={name}>{label || name}</label>
		<input
			className="jform-input"
			name={name}
			onChange={ ({ currentTarget:input }) => onChange(input.value) }
			{...rest}
		/>
		{error && <div className="jform-error">{error}</div>}
	</div>
);



export default Input;
