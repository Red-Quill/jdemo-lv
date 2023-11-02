import React from "react";
import { itemList } from "../common.js";



type dropDownMenuTypes = { itemList:itemList,position:[ number,number,boolean,boolean ] };

const DropdownMenu = ({ itemList,position:[ left,top,atTop,atEnd ] }:dropDownMenuTypes) => (
	<ul
		className="jnavbar-dropdown-items"
		style={{
			position : "fixed",
			left,
			top,
			transform : atEnd ? atTop ? "translate(-100px)" : "translateY(-100%)" : "",
		}}
	>
		{itemList.map(({ _id,Type,data }) => <Type key={_id} {...data} />)}
	</ul>
);



export default DropdownMenu;
