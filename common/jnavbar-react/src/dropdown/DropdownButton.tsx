import React from "react";
import { NavLink } from 'react-router-dom';
import { NavBarItemContent,_symbol } from "../common.js";
import arrowDownSymbol from "../static/arrow-down-solid.svg";
import arrowRightSymbol from "../static/arrow-right-solid.svg";



type dropDownButtonTypes = { onClick:any,symbol?:_symbol,Component?:any,text?:string,arrowDown:boolean }

const DropdownButton = ({ onClick,symbol,Component,text,arrowDown }:dropDownButtonTypes) => (
	<span className="jnavbar-dropdownbutton" onClick={onClick}>
		<NavBarItemContent symbol={symbol} Component={Component} text={text} />
		<img src={arrowDown ? arrowDownSymbol : arrowRightSymbol} alt="Dropdown arrow" style={{ height:30 }}/>
	</span>
);



export default DropdownButton;

/*
*/
