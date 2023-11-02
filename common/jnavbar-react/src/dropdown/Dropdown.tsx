import React,{ useRef,RefObject,useState,useEffect,useLayoutEffect,useContext } from 'react';
import { NavBarPositionContext } from '../navbarPositionContext.js';
import DropdownButton from './DropdownButton.js';
import DropdownMenu from './DropdownMenu.js';
import type { _symbol, itemList } from '../common.js';



const useContainerPosition = (ref:RefObject<HTMLDivElement>) => {
	const [ position,setPosition ] = useState({ left:[0,0],top:[0,0],right:[0,0],bottom:[0,0],width:0,height:0 });
  
	useLayoutEffect(() => {
		const handleResize = () => {
			if(!ref.current) return;
			const { left,right,top,bottom } = ref.current.getBoundingClientRect();
			const { offsetWidth,offsetHeight } = ref.current;
			const newDimensions = {
				left         : [ left           , (top+bottom)/2 ],
				top          : [ (left+right)/2 , top            ],
				right        : [ right          , (top+bottom)/2 ],
				bottom       : [ (left+right)/2 , bottom         ],
				width        : offsetWidth,
				height       : offsetHeight,
			};
			setPosition(newDimensions);
		}
		if (ref.current) handleResize();
		window.addEventListener("resize", handleResize)
		return () => { window.removeEventListener("resize", handleResize) }
	},[ref]);
  
	return position;
};



type dropDownTypes = { itemList:itemList,symbol?:_symbol,text:string };

const Dropdown = ({ itemList,symbol,text }:dropDownTypes) => {
	const self = useRef<HTMLDivElement>(null);
	const [ showMenu,setShowMenu ] = useState(false);
	const [ position,layoutWidth,layoutHeight ] = useContext(NavBarPositionContext)
	const { left:[ leftX,leftY ], top:[ topX,topY ],right:[ rightX,rightY ],bottom:[ bottomX,bottomY ],width,height } = useContainerPosition(self);
	
	// --> Close menu when click outside
	const handleMouseClickOutside = (event:any) => {
		if(self.current && !self.current.contains(event.target))
			setShowMenu(false);
	};
	
	useEffect( () => {
		document.addEventListener("mousedown", handleMouseClickOutside);
		return () => {document.removeEventListener("mousedown", handleMouseClickOutside);};
	},[self]);
	// <-- Close menu when click outside

	return (
		<li className="jnavbar-items-item">
			<div ref={self}>
				<DropdownButton symbol={symbol} text={text} onClick={ () => setShowMenu(!showMenu) } arrowDown={ position !== "left" }/>
				{showMenu && <DropdownMenu
					itemList={itemList}
					position={
						position === "left" ?
							[ 150,topY,false,leftY*2>layoutHeight ]
							:
							[ topX*2<layoutWidth ? leftX : rightX ,50,true,topX*2>layoutWidth ]
					}
				/>}
			</div>
		</li>
	);
};



export default Dropdown;
