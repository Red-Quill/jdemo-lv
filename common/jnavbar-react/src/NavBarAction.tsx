import React from "react";
import { NavBarItemContent } from "./common.js";



const NavBarAction = ({ onClick,symbol,text }:{ onClick:any,symbol:{ src:string,alt:string },text:string }) => (
	<li className="jnavbar-items-item">
		<span className="jnavbar-action" onClick={onClick}>
			<NavBarItemContent symbol={symbol} text={text} />
		</span>
	</li>
);



export default NavBarAction;
