import React from "react";
import { NavLink } from 'react-router-dom';
import { NavBarItemContent, _symbol } from "./common.js";



type navBarLinkTypes = { to:string,symbol:_symbol,text:string,onClick?:any };

const NavBarLink = ({ to,symbol,text,onClick }:navBarLinkTypes) => (
	<li className="jnavbar-items-item">
		<NavLink to={to} onClick={onClick}>
			<NavBarItemContent symbol={symbol} text={text}/>
		</NavLink>
	</li>	
);



export default NavBarLink;
