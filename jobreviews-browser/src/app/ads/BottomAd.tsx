import React,{ useContext } from "react";
import { AppLayoutStyleContext } from "../Contexts";



const BottomAd = () => {
	const layoutStyle = useContext(AppLayoutStyleContext);

	return (
		<div className={`jbottomad jbottomad-${layoutStyle}`}>
			<div className="jad-inner">
				Bottom Ad
			</div>
		</div>
	);
};



export default BottomAd;