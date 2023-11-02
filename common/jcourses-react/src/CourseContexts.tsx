import React,{ ReactNode,createContext } from 'react';
import type JCoursesClient from 'jcourses-client';



const JCoursesClientContext = createContext<any>(null);
JCoursesClientContext.displayName = "JCoursesClientContext";

const LayoutStyleContext = createContext<any>(null);
LayoutStyleContext.displayName = "LayoutStyleContext";

type courseContextsPT = {
	jCoursesClient:JCoursesClient;
	layoutStyle:string;
	children:ReactNode;
};

const CourseContexts = ({ jCoursesClient,layoutStyle,children }:courseContextsPT) => (
	<JCoursesClientContext.Provider value={jCoursesClient}>
		<LayoutStyleContext.Provider value={layoutStyle}>
			{children}
		</LayoutStyleContext.Provider>
	</JCoursesClientContext.Provider>
);



export default CourseContexts;
export { JCoursesClientContext,LayoutStyleContext };
