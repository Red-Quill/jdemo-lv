import React from "react";



type _symbol = { src?:string,alt?:string,Component?:any,[key:string]:any };
type symbolComponent = { Component?:any,[key:string]:any };
type item = { _id:number,Type:any,data:any };
type itemList = item[];
type navBarItemContentTypes = { symbol?:_symbol,Component?:any;text?:string };

const NavBarItemContent = ({ symbol,text }:navBarItemContentTypes) => (
	<>
		{symbol?.src && <img src={symbol.src} alt={symbol.alt} height={30}/>}
		{symbol?.Component && <SymbolComponent symbol={symbol} />}
		{text || null}
	</>
);

const SymbolComponent = ({ symbol:{ Component,...rest } }:{ symbol:symbolComponent }) => (
	<Component {...rest}/>
);


export { NavBarItemContent };
export type { itemList,_symbol }
