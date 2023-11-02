import React,{ useState,useEffect,useContext,useRef,useLayoutEffect } from 'react';
import { Course,CourseData,CourseDataIntro,CourseDataChapter,CourseDataSection,CourseDataPart,CoursePartTheory,CoursePartExercise,emptyCourse } from 'jcourses-client';
import { JCoursesClientContext,LayoutStyleContext } from './CourseContexts.js';



type coursePlayerPT = {
	course:Course;
	showSidebar:boolean;
	sidebarControls:{ enableSideToggler:any,disableSideToggler:any };
};

type scrollToType = { _id:string };

const CoursePlayer = ({ course,showSidebar,sidebarControls:{ enableSideToggler,disableSideToggler } }:coursePlayerPT) => {
	const coursePlayerRef = useRef<HTMLDivElement>(null);
	const jCoursesClient = useContext(JCoursesClientContext);
	const layoutStyle = useContext(LayoutStyleContext);
	const [ courseData,setCourseData ] = useState<CourseData>(emptyCourse);
	const [ chapter,setChapter ] = useState<CourseDataChapter | CourseDataIntro>(emptyCourse.intro);
	const [ scrollTo,setScrollTo ] = useState<scrollToType>({ _id:"" });

	const fetchContent = async () => {
		try {
			const courseData = await jCoursesClient.getCourseData(course);
			setCourseData(courseData);
			setChapter(courseData.intro || courseData.chapters[0]);
		} catch (error) {
			console.log(error)
		}
	};

	const setTarget = (_chapter:CourseDataChapter | CourseDataIntro,_scrollTo:string) => {
		const historyState:any = {};
		if(_chapter !== chapter) {
			historyState.chapterId = chapter._id;
			setChapter(_chapter);
		}
		historyState.scrollToId = scrollTo._id;
		setScrollTo({ _id:_scrollTo});
		history.pushState({ jCoursesCoursePlayer:historyState },"jcourses",window.location.pathname);
	};

	const doScroll = (ref:any) => {
		const topPos = ref?.current?.offsetTop || 0;
		if (coursePlayerRef.current) {
			coursePlayerRef.current.scrollTop = topPos;
		}
	};

	const backButtonHandler = (event:PopStateEvent) => {
		if(!event.state?.jCoursesCoursePlayer) return;
		const { chapterId,scrollToId } = event.state.jCoursesCoursePlayer;
		if(chapterId !== chapter._id) {
			const _chapter = courseData.chapters.find((_) => _._id === chapterId);
			if(_chapter) setChapter(_chapter);
		}
		if(scrollToId) {
			setScrollTo({ _id:scrollToId });
		}
	};
	
	useEffect(() => {
		window.addEventListener("popstate",backButtonHandler);
		return () => {window.removeEventListener("popstate",backButtonHandler)};
	},[]);



	useEffect(() => {
		fetchContent();
	},[]); // add user to dependency array later

	useEffect(() => {
		enableSideToggler(true);
		return () => { disableSideToggler(false) }
	},[]);

	return (
		<>
			{(layoutStyle === "large" || showSidebar) && <TableOfContents title={course.name} intro={courseData.intro} chapters={courseData.chapters} setTarget={setTarget} />}
			<CourseContentFrame coursePlayerRef={coursePlayerRef} course={course} content={chapter} scrollTo={scrollTo} doScroll={doScroll} />
		</>
	);
};



type tableOfContentsPropTypes = {
	title:string;
	intro:CourseDataIntro;
	chapters:CourseDataChapter[];
	setTarget:Function;
}

const TableOfContents = ({ title,intro,chapters,setTarget }:tableOfContentsPropTypes) => {
	const layoutStyle = useContext(LayoutStyleContext);

	return (
		<div className={`courses-course-toc courses-course-toc-${layoutStyle}`}>
			<ul>
				<li className="courses-course-toc-item">
					{intro ?
						<span className="courses-course-toc-item-link" onClick={() => setTarget(intro,"")} style={{ display:"block" }}>
							{title}
						</span>
						:
						title
					}
				</li>
				{chapters.map((chapter) => (
					<li key={chapter._id} className="courses-course-toc-item">
						<span className="courses-course-toc-item-link" onClick={() => setTarget(chapter,chapter._id)} style={{ display:"block" }}>
							{chapter.header}
						</span>
						{chapter.sections.length > 0 ?
							<ul className="courses-course-toc-sections">
								{chapter.sections.map((section) => (
									<li className="courses-course-toc-sections-item" key={section._id}>
										<span className="courses-course-toc-item-link" onClick={() => setTarget(chapter,section._id)} style={{ display:"block" }}>
											{section.header}
										</span>
									</li>
								))}
							</ul>
							:
							null
						}
					</li>
				))}
			</ul>
		</div>
	);
};



type coursePlayerPropTypes = {
	coursePlayerRef:any;
	course:Course;
	content:CourseDataChapter | CourseDataIntro | null;
	scrollTo:scrollToType;
	doScroll:(self:any)=>void;
}

const CourseContentFrame = ({ coursePlayerRef,course,content,scrollTo,doScroll }:coursePlayerPropTypes) => {
	const layoutStyle = useContext(LayoutStyleContext);

	useLayoutEffect(()=>{
		if(content && scrollTo._id === content._id) doScroll(coursePlayerRef);
	},[scrollTo]);

	return (
		<div ref={coursePlayerRef} className={`courses-course-chapter courses-course-chapter-${layoutStyle}`}>
			<CourseContent course={course} content={content} scrollTo={scrollTo} doScroll={doScroll}/>
		</div>
	)
}



type coursePlayerContentPropTypes = {
	course:Course;
	content:CourseDataChapter | CourseDataIntro | null;
	scrollTo:scrollToType;
	doScroll:(self:any)=>void;
}

const CourseContent = ({ course,content,scrollTo,doScroll }:coursePlayerContentPropTypes) => {
	if (content instanceof CourseDataChapter) return <Chapter chapter={content} course={course} scrollTo={scrollTo} doScroll={doScroll} />;
	if (content instanceof CourseDataIntro) return <Intro intro={content} course={course} />;
	throw Error(`Invalid course countent type:${content}`);
}


type chapterPropTypes = {
	course:Course;
	chapter:CourseDataChapter;
	scrollTo:scrollToType;
	doScroll:(self:any)=>void;
}

const Chapter = ({ chapter,course,scrollTo,doScroll }:chapterPropTypes) => {
	const { _id,header,intro,sections } = chapter;

	return (
		<>
			<h1 id={_id}>{header}</h1>
			{intro ? intro.parts.map((part) => <Item key={part._id} item={part} course={course} />) :null}
			{sections.map((section) => <Section key={section._id} section={section} course={course} scrollTo={scrollTo} doScroll={doScroll}/>)}
		</>
	);
};



type introPropTypes = {
	course:Course;
	intro:CourseDataIntro;
};

const Intro = ({ course,intro }:introPropTypes) => {
	const { _id,parts } = intro;

	return (
		<>
			<h1 id={_id}>{course.name}</h1>
			{parts.map((part) => <Item key={part._id} item={part} course={course} />)}
		</>
	);
};



type sectionPropTypes = {
	course:Course;
	section:CourseDataSection;
	scrollTo:scrollToType;
	doScroll:(self:any)=>void;
};

const Section = ({ section,course,scrollTo,doScroll }:sectionPropTypes) => {
	const self = useRef(null);
	const layoutStyle = useContext(LayoutStyleContext);
	const { _id,header,parts } = section;

	useLayoutEffect(()=>{
		if(scrollTo._id === _id) setTimeout(() => doScroll(self),100);
	},[scrollTo]);

	return (
		<div ref={self} className={`courses-course-section courses-course-section-${layoutStyle}`}>
			<h2 id={_id}>{header}</h2>
			{parts.map((part) => <Item key={part._id} item={part} course={course} />)}
		</div>
	);
};



type itemPropTypes = {
	course:Course;
	item:CourseDataPart;
}

const Item = ({ item,course }:itemPropTypes) => {
	switch (item.type) {
		case "t":return <Theory item={item} course={course} />;
		case "a":return <Exercise item={item} course={course} />;
		default:throw new Error("Invalid item type");
	}
};



const Theory = ({ item,course }:itemPropTypes) => {
	const jCoursesClient = useContext(JCoursesClientContext);
	const [itemData,setItemData] = useState<CoursePartTheory | null>(null);

	const fetchItem = async () => {
		const itemData = await jCoursesClient.getCourseTheory(course,item);
		setItemData(itemData)
	}

	useEffect(() => { fetchItem() },[])

	if (!itemData) return null;
	return <div className="madtheory" dangerouslySetInnerHTML={{ __html:itemData.theory }} />;
};



const Exercise = ({ item,course }:itemPropTypes) => {
	const jCoursesClient = useContext(JCoursesClientContext);
	const [itemData,setItemData] = useState<CoursePartExercise | null>(null);

	const fetchItem = async () => {
		const itemData = await jCoursesClient.getCourseExercise(course,item);
		setItemData(itemData)
	}

	useEffect(() => { fetchItem() },[])

	if (!itemData) return null;
	return (
		<div className="madexercise">
			<div style={{ display:"flex",justifyContent:"space-between" }}>
				<span>Tehtävä</span>
				<span>{itemData.number}</span>
			</div>
			<div className="madexercise-a" dangerouslySetInnerHTML={{ __html:itemData.assignment }} />
			{itemData.help ? <ExerciseHelp html={itemData.help} /> :null}
			{itemData.rightAnswer ? <ExerciseRightAnswer html={itemData.rightAnswer} /> :null}
			{itemData.solution ? <ExerciseSolution html={itemData.solution} /> :null}

		</div>
	);
};



const ExerciseHelp = ({ html }:any) => {
	const [show,setShow] = useState<boolean>(false);

	const toggleShow = () => setShow(!show)

	return (
		<>
			<hr />
			<div style={{ display:"flex",justifyContent:"space-between" }}>
				<span>Vihje</span>
				<button onClick={toggleShow}>{show ? "Piilota" :"Näytä"}</button>
			</div>
			{show ? <div className="madexercise-h" dangerouslySetInnerHTML={{ __html:html }} /> :null}
		</>
	);
};

const ExerciseRightAnswer = ({ html }:any) => {
	const [show,setShow] = useState<boolean>(false);

	const toggleShow = () => setShow(!show)

	return (
		<>
			<hr />
			<div style={{ display:"flex",justifyContent:"space-between" }}>
				<span>Oikea vastaus</span>
				<button onClick={toggleShow}>{show ? "Piilota" :"Näytä"}</button>
			</div>
			{show ? <div className="madexercise-r" dangerouslySetInnerHTML={{ __html:html }} /> :null}
		</>
	);
};

const ExerciseSolution = ({ html }:any) => {
	const [show,setShow] = useState<boolean>(false);

	const toggleShow = () => setShow(!show)

	return (
		<>
			<hr />
			<div style={{ display:"flex",justifyContent:"space-between" }}>
				<span>Malliratkaisu</span>
				<button onClick={toggleShow}>{show ? "Piilota" :"Näytä"}</button>
			</div>
			{show ? <div className="madexercise-s" dangerouslySetInnerHTML={{ __html:html }} /> :null}
		</>
	);
};



export default CoursePlayer;
