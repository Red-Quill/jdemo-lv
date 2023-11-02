import React,{ useEffect,useState,useContext } from 'react';
import { JCoursesClientContext } from './CourseContexts.js';
import Table from "./common/Table.js";
//import BuyOrAddButton from './BuyOrAddButton';



type catalogPT = {
	gotoCourse:Function;
};

const Catalog = ({ gotoCourse }:catalogPT) => {
	//const user = useContext(UserContext);
	const jCoursesClient = useContext(JCoursesClientContext);
	const [ _courses,setCourses ] = useState<any[]>([]);
	const [ headers,setHeaders ] = useState<any[]>([]);
	const [ failed,setFailed ] = useState<boolean>(false);

	const fetchCourses = async() => {
		const headers = [{ name:"",label:"icon" },{ name:"Kurssi",label:"name" }];
		//if(user._id) headers.push({name:"",label:"buyOrOpen"});
		setHeaders(headers);
		const courseCatalog = await jCoursesClient.getCourseCatalog();
		setFailed(courseCatalog.length === 0)
		// @ts-ignore
		const courseItems = courseCatalog.map((course) => ({
			_id : course._id,
			name : <span className="courses-catalog-item-link" onClick={() => gotoCourse(course)}>{course.name}</span>,
			icon : <img src={`/media/${course.iconFileName}`} height="50" width="50" alt="course icon" />,
			//buyOrOpen :<></>,
		}));
		setCourses(courseItems);
	};

	useEffect(() => {
		fetchCourses();
	},[]) // add user later

	return (
		<div className="courses-catalog">
			<h1>Kurssit</h1>
			{failed ? <FailPage fetchCourses={fetchCourses} /> : <Table headers={headers} data={_courses} />}
		</div>
	);
};



type failPagePT = {
	fetchCourses:Function;
}

const FailPage = ({ fetchCourses }:failPagePT) => {
	useEffect(() => {
		const x = setInterval(fetchCourses,60_000);
		return () => clearInterval(x);
	},[]);

	return (
		<>
			<p>Kurssien lataaminen epäonnistui</p>
			<button onClick={() => fetchCourses()}>Yritä uudestaan</button>
		</>
	);
}

export default Catalog;

/*

*/
