import React from "react";



type radioButtonPT = {
	label?:string;
	value:string;
	onChange:Function;
	name:string;
	checked?:boolean;
};

// name = name of the group that contains these radiobuttons
const RadioButton = ({ label,value,name,onChange,checked }:radioButtonPT) => (
	<div className="jform-radiobutton">
		<input type="radio" name={name} id={value} value={value} onChange={() => onChange(value)} checked={checked}/>
		<label className="jform-radiobutton-label" htmlFor={value}>{label || value}</label>
	</div>
);



export default RadioButton;


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



const RadioButtons = ({ name,label,onChange,error,children,...rest }:radioButtonsPT) => (
	<div className="jform-radiobuttons">
		<legend className="jform-label">{label || name}</legend>

		{children}

		<input
			className="jform-input"
			name={name}
			onChange={ ({ currentTarget:input }) => onChange(input.value) }
			{...rest}
		/>

		{error && <div className="jform-error">{error}</div>}
	</div>
);

*/