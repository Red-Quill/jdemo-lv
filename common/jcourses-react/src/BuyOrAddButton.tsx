import React,{ useContext } from 'react';
//import type { Course } from 'jcourses';
//import { AppContext, TranslationContext } from '../../../Contexts.js';



type propTypes = { course:any };

const BuyOrAddButton = ({ course }:propTypes) => {
	//const { notifications:{ showNotification,showWarning } } = useContext(AppContext);

	const handleCourseAdd = async () => {
		try {
			//await courses.addCourseToUser(course);
		} catch (error:any) {
			//showWarning(error);
			return;
		}
		//showNotification(`Kurssi ${course.name} lisätty omiin kursseihin`);
	};

	//later add pricing
	return <button onClick={handleCourseAdd}>Ilmainen, lisää omiin kursseihin</button>
};



export default BuyOrAddButton;
