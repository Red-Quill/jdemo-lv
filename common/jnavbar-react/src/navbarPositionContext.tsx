import React,{ createContext } from 'react';



const NavBarPositionContext = createContext<any>(null);
NavBarPositionContext.displayName = "NavBarPositionContext";

const LayoutStyleContext = createContext<any>(null);
LayoutStyleContext.displayName = "LayoutStyleContext";

type navBarPositionContextPT = {
	navbarPositionAndDimensions:any;
	layoutStyle:string;
	children:any
};

const NavbarPositionContextProvider = ({ navbarPositionAndDimensions,layoutStyle,children }:navBarPositionContextPT) => (
	<NavBarPositionContext.Provider value={navbarPositionAndDimensions}>
		<LayoutStyleContext.Provider value={layoutStyle}>
			{children}
		</LayoutStyleContext.Provider>
	</NavBarPositionContext.Provider>
);



export default NavbarPositionContextProvider;
export { NavBarPositionContext,LayoutStyleContext };
