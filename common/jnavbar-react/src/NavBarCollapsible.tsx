import React,{ useContext } from 'react';
import { LayoutStyleContext } from './navbarPositionContext.js';
import Dropdown from './dropdown/Dropdown.js';
import type { itemList } from './common.js';



type navBarCollapsiblePT = {
	itemList:itemList;
	symbol:any;
	text:string;
};

const NavBarCollapsible = (props:navBarCollapsiblePT) => {
	const { itemList } = props;
	const layoutStyle = useContext(LayoutStyleContext);

	return layoutStyle === "large" ?
		<>
			{itemList.map( ({ _id,Type,data }) => <Type key={_id} {...data} /> )}
		</>
		:
		<Dropdown {...props} />
	;
}



export default NavBarCollapsible;
