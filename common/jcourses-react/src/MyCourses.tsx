import React,{ useContext, useEffect, useState } from 'react';
import Table from "./common/Table.js";
//import { TranslationContext,UserContext } from '../../../Contexts.js';



const MyCourses = () => {
	//const navigate = useNavigate()
	const [ headers,setHeaders ] = useState<any[]>([]);
	const [ _courses,setCourses ] = useState<any[]>([]);
	//const user = useContext(UserContext);
	//const t = useContext(TranslationContext);

	const fetchCourses = async () => {
		setHeaders([{ name:"",label:"icon" },{ name:"kurssi",label:"name" }]);
		//const courseData = await courses.getUserCourses();
		//console.log(courseData)
		// @ts-ignore
		const courseItems = Array.from(courseData,([key,course]) => ({
			_id: course._id,
			name: <span className="courses-catalog-item-link" onClick={() => console.log(course)}>{course.name}</span>,
			icon: <img src={`/media/${course.iconFileName}`} height="50" width="50" alt="course icon" />,
		}));
		setCourses(courseItems);
	};

	//useEffect(() => { user._id ? fetchCourses() : navigate("/", { replace: true }) }, [user]); TMP off

	return (
		<div className="courses-catalog">
			<h1>Kurssini</h1>
			<Table headers={headers} data={_courses} />
		</div>
	);
};



export default MyCourses;
