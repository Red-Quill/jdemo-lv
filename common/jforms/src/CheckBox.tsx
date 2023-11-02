import React from "react";



type CheckBoxPt = {
	name:string;
	label?:any;
	onChange?:any;
	error?:string;
	[key:string]:any;
};

const CheckBox = ({ name,label,onChange=(_:any)=>{},error,...rest }:CheckBoxPt) => {

	return (
		<div className="jform-field">
			<input
				type="checkbox"
				className="jform-checkbox"
				name={name}
				onChange={({ currentTarget }) => onChange(currentTarget.value)}
				{...rest}
			/>
			<label className="jform-label" htmlFor={name}>{label || name}</label>
			{error && <div className="jform-error">{error}</div>}
		</div>
	);
};



export default CheckBox;
