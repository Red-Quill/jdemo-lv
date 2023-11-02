import React,{ useState,useEffect } from 'react';
import Catalog from './Catalog.js';
import CoursePlayer from './CoursePlayer.js';
import CourseContexts from './CourseContexts.js';
import { noCourse } from 'jcourses-client';
import type JCoursesClient from "jcourses-client";
import type { Course } from "jcourses-client";
import "./Courses.scss";



type coursesPT = {
	jCoursesClient:JCoursesClient;
	layoutStyle:string;
	showSidebar:boolean;
	sidebarControls:{ enableSideToggler:any,disableSideToggler:any };
	courseControl?:{ course:Course };
};

const Courses = ({ jCoursesClient,layoutStyle,showSidebar,sidebarControls,courseControl }:coursesPT) => {
	const [ course,setCourse ] = useState<Course>(noCourse);
	//const { setNavbarCustomItems } = useContext(NavbarContext);
	//const user = useUser();
	//const language = useLanguage();

	const gotoCatalog = () => {
		history.pushState({ type:"jCourses" },"","");
		setCourse(noCourse);
	};

	const gotoCourse = (_course:Course) => {
		if(_course._id === course._id) return;
		history.pushState({ jCourses : course._id },"app",window.location.pathname);
		setCourse(_course);
	};

	const backButtonHandler = async(event:PopStateEvent) => {
		if(!event.state?.jCourses) return;
		const { courseId } = event.state.jCourses;
		if(courseId !== course._id) {
			const _course = await jCoursesClient.getCourse(courseId);
			if(_course) setCourse(_course);
		}
		console.log(event.state);
	};
	
	useEffect(() => {
		window.addEventListener("popstate",backButtonHandler);
		return () => {window.removeEventListener("popstate",backButtonHandler)};
	},[]);

	useEffect(() => {
		if(!courseControl) return;
		gotoCourse(courseControl.course);
	},[courseControl]);

	/*
	const navBarUserItems = [
		{
			_id : 210,
			Type : NavBarCollapsible,
			data: {
				itemList : [
					{ _id:220,Type:NavBarLink,data:{ to:"/courses/mycourses",text:t("My courses") } },
					{ _id:230,Type:NavBarLink,data:{ to:"/logout",text:t("Sign out") } },
				],
				symbol : { src:userIcon,alt:"User menu"},
			},
		}
	];

	const navBarNoUserItems = [
		{
			_id : 240,
			Type : NavBarCollapsible,
			data: {
				itemList : [
					{ _id:250,Type:NavBarLink,data:{ to:"/register",text:t("Sign up") } },
					{ _id:260,Type:NavBarLink,data:{ to:"/login",text:t("Sign in") } },
				],
				symbol : { src:userIcon,alt:"User menu"},
			},
		}
	];

	useEffect( () => {
		setNavbarCustomItems(user._id ? navBarUserItems : navBarNoUserItems);
		return () => setNavbarCustomItems([]);
	},[user,language])
	*/

	return (
		<div className="courses">
			<CourseContexts jCoursesClient={jCoursesClient} layoutStyle={layoutStyle}>
				{course._id ? <CoursePlayer course={course} showSidebar={showSidebar} sidebarControls={sidebarControls} /> : <Catalog gotoCourse={gotoCourse}/>}
			</CourseContexts>
		</div>
	);
};



export default Courses;
