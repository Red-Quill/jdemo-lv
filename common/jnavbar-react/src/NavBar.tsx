import React,{ useRef } from 'react';
import useElementDimensions from './useElementDimensions.js';
import NavbarPositionContextProvider from './navbarPositionContext.js';
import type { itemList } from "./common.js";



type navBarPT = {
	itemLists:{ _id:number,itemList:itemList }[];
	position:string;
	layoutStyle:string;
};

const NavBar = ({ itemLists,position,layoutStyle }:navBarPT) => {
	const self = useRef(null);
	const [ width,height ] = useElementDimensions(self)

	return (
		<NavbarPositionContextProvider navbarPositionAndDimensions={[position,width,height]} layoutStyle={layoutStyle}>
			<nav ref={self} className={`jnavbar jnavbar-${layoutStyle}`}>
				<div className={`jnavbar-inner jnavbar-inner-${layoutStyle}`}>
					{itemLists.map(({ _id,itemList }) => (
						itemList
						&&
						<ul className={`jnavbar-items jnavbar-items-${layoutStyle}`} key={_id}>
							{itemList.map(({ _id,Type,data }) => <Type key={_id} {...data} />)}
						</ul>
					))}
				</div>
			</nav>
		</NavbarPositionContextProvider>
	);
};



export default NavBar;
