import React,{ useContext } from "react";
import { AppLayoutStyleContext } from "../Contexts";



const SideAd = () => {
	const layoutStyle = useContext(AppLayoutStyleContext);
	
	return (
		<div className={`jsidead jsidead-${layoutStyle}`}>
			<div className="jad-inner">
				Side Ad
			</div>
		</div>
	);
};



export default SideAd;
