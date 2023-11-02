import React from "react";



type ComboBoxItemData = {
	_id : string;
	value : string;
	[key:string] : any;
}

type ComboBoxPT = {
	items:ComboBoxItemData[];
};

const ComboBox = ({ items }:ComboBoxPT) => (
	items.map(({ _id,value }) => (
		<div key={_id} className="jforms-combobox-item">
			{value}
		</div>
	)
));



export default ComboBox;