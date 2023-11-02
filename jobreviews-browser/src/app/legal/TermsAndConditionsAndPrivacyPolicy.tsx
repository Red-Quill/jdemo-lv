import React,{ useContext } from "react";
import { LanguageContext } from "../Contexts";
import TermsOfServiceAndPrivacyPolicyEn from "./TermsOfServiceAndPrivacyPolicyEn";
import TermsOfServiceAndPrivacyPolicyFi from "./TermsOfServiceAndPrivacyPolicyFI";



const TermsAndconditionsAndPrivacyPolicy = () => {
	const language = useContext(LanguageContext)

	switch(language) {
		case "fi" : return <TermsOfServiceAndPrivacyPolicyFi />;
		default : return <TermsOfServiceAndPrivacyPolicyEn />;
	}
};



export default TermsAndconditionsAndPrivacyPolicy;
