import React, {useState} from "react";
import RadioButton from "./RadioButton.js";



// TODO radio button with children ... inject name and onChange fields

type radioButtonsPT = {
	name:string;
	label?:string;
	onChange?:any;
	error?:string;
	children?:any;
	choices?:any;
	initialChoice?:any;
	value?:any;
};

const RadioButtons = ({ name,label,onChange,error,choices,initialChoice,children }:radioButtonsPT) => {
	return (
		<div className="jform-radiobuttons">
			<legend className="jform-label">{label || name}</legend>
			{choices ?
				<RadioButtonChoices choices={choices} initialChoice={initialChoice} onChange={onChange} name={name} />
				:
				children
			}
			{error && <div className="jform-error">{error}</div>}
		</div>
	);
};



type choice = { label?:string,value:string };

type RadioButtonChoicesPT = {
	choices:choice[];
	onChange:Function;
	name:string;
	initialChoice?:string;
};

const RadioButtonChoices = ({ choices,onChange,name,initialChoice }:RadioButtonChoicesPT) => {
	const [ choice,setChoice ] = useState(initialChoice);

	const doChange = (value:string) => {
		setChoice(value);
		onChange(value);
	}

	return (
		choices.map(({ label,value }) => (
			<RadioButton
				key={value}
				label={label}
				value={value}
				name={name}
				onChange={doChange}
				checked={value===choice}
			/>
		))
	);
};



export default RadioButtons;






/*
const RadioButtonGroup = ({ selectedOption, onChange }) => {
  return (
	<div>
	  <label>
		<input
		  type="radio"
		  name="options"
		  value="A"
		  checked={selectedOption === 'A'}
		  onChange={() => onChange('A')}
		/>
		Option A
	  </label>
	  <br />
	  <label>
		<input
		  type="radio"
		  name="options"
		  value="B"
		  checked={selectedOption === 'B'}
		  onChange={() => onChange('B')}
		/>
		Option B
	  </label>
	  <br />
	  <label>
		<input
		  type="radio"
		  name="options"
		  value="C"
		  checked={selectedOption === 'C'}
		  onChange={() => onChange('C')}
		/>
		Option C
	  </label>
	</div>
  );
};




<fieldset>
  <legend>Select a maintenance drone:</legend>

  <div>
	<input type="radio" id="huey" name="drone" value="huey" checked />
	<label for="huey">Huey</label>
  </div>

  <div>
	<input type="radio" id="dewey" name="drone" value="dewey" />
	<label for="dewey">Dewey</label>
  </div>

  <div>
	<input type="radio" id="louie" name="drone" value="louie" />
	<label for="louie">Louie</label>
  </div>
</fieldset>
*/