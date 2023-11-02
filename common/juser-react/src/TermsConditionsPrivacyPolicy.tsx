import React, {useState} from "react";
import { Button,CheckBox } from "jforms";



type TermsConditionsPrivacyPolicyPT = {
	terms:any;
	onChange:Function;
	t?:Function;
};

const TermsConditionsPrivacyPolicy = ({ terms,onChange,t=(_:string)=>_ }:TermsConditionsPrivacyPolicyPT) => {
	const [ accepted,setAccepted ] = useState(false);
	const [ showTerms,setShowTerms ] = useState(false);

	const decline = () => {
		setAccepted(false);
		onChange("");
		setShowTerms(false);
	};

	const accept = () => {
		const now = (new Date()).toISOString();
		setAccepted(true);
		onChange(now);
		setShowTerms(false);
	};

	return (
		<>
			<CheckBox name="terms" onClick={() => setShowTerms(true)} label={<a href="#" onClick={() => setShowTerms(true)}>{t("Accept terms & conditions and privacy policy")}</a>} checked={accepted}/>
			{showTerms &&			
				<div className="juser-terms">
					<div className="juser-terms-inner">
						{terms}
						<div>
							<Button onClick={accept}>{t("Accept")}</Button>
							<Button onClick={decline}>{t("Decline")}</Button>
						</div>
					</div>
				</div>
			}
		</>
	);
};



export default TermsConditionsPrivacyPolicy;
