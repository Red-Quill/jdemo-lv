import React,{ useContext } from "react";
import { NavLink } from "react-router-dom";
import MiniSearch from "./MiniSearch";
import { TranslationContext } from "../Contexts";
import Auth from "./Auth";



const Home = () => {
	const t = useContext(TranslationContext);

	return (
		<div>
			<MiniSearch />
			<p>
				Did you know that bad employment decision can set you back years on your career? That's why we are here to help. Avoid employers that could set you back financially and destroy your mental and even physical health. This site contain also positive warnings that you can use to get ahead with your working life goals.
			</p>
			<h1>Rules of the service</h1>
			<p>
				By using this service you have agreed to the terms and conditions.
			</p>
			<p>
				The sole purpose of this service is to help job seekers to find good and better jobs and of course to avoid bad employers. It is not meant for badmouthing employers but giving detailed and objective information for job seekers. If you have actual bad experiences like consistently being treated badly by management, not receiving correct salary, safety violations etc... be vocal about it. Try to be as precise and descriptive as you can without being identifiable (if you care about that). Tell us about good employers too. That will help good workplaces to get good employees. Sometimes previously bad workplace becomes good e.g. when management is changed. Tell us if you observed that a previously bad workplace has turned itself around and is nowadays a good place to work. Unfortunately it is also really common for a good workplace to be destroyed by new incompetent management and it is important to report these changes here that future job seekers know to avoid those places.
			</p>
			<p>
				Always take everything that is said here with a grain of salt. Some bad reviews might be hate reviews from people who got terminated for good reason. It is also possible for companies to write false reviews about themselves. However, if a workplace/company only gets bad reviews it probably is bad employer. Use information you get from here as guidance during your job search and when applying to a specific job. Seek information from elsewhere too and keep your senses sharp during interview process. A bad employment decision can set you back several years on your career.
			</p>
			<p>
				Publishing names or initials, phone numbers, addresses or any other personal or sensitive information, or corporate secrets (especially those protected by law) is strictly prohibited.
			</p>
			<NavLink to="/app/terms">{t("Terms, conditions, and privacy policy")}</NavLink>
			{/*<Auth />*/}
		</div>
	);
};



export default Home;
