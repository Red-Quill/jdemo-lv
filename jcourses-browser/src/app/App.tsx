import React,{ useState,useRef,useEffect,useContext,useLayoutEffect } from 'react';
import { Routes,Route,Navigate,BrowserRouter,Outlet,useNavigate, useSearchParams } from 'react-router-dom';

import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

import UIContexts,{ AppLayoutStyleContext,NavbarContext,TranslationContext,UserContext } from './Contexts';
import useElementDimensions from './useElementDimensions';
import NavBar,{ NavBarLink,NavBarAction } from "jnavbar-react";

import "./App.scss";
import Courses from "jcourses-react";
import { Login,Register,Activate,ResetPassword,NewPassword,UserManagement,VerifyEmail } from "juser-react";
import "juser-react/User.scss"

import NotFound from './NotFound';

import menuIcon from "../static/menu.svg";
import { noCourse } from 'jcourses-client';



const App = ({ jCoursesApp }:any) => {
	const { setLanguage,jCoursesClient,notifications,jUserClient } = jCoursesApp;

	const self = useRef<HTMLDivElement>(null);
	const [ width,height ] = useElementDimensions(self);
	const [ layoutStyle,setLayoutStyle ] = useState<string>("narrow");
	const [ navbarCustomItems,setNavbarCustomItems ] = useState([]);
	const [ xenableSideToggler,setEnableSideToggler ] = useState<boolean>(false);
	const [ showSidebar,setShowsidebar ] = useState<boolean>(false);
	const [ courseControl,setCourseControl ] = useState<any>({ course:noCourse });

	// -->
	const [ language,_setLanguage ] = useState<string>(jCoursesApp.language);
	const [ translation,setTranslation ] = useState(() => (text:string) => jCoursesApp.translate(text));
	const [ user,setUser ] = useState(jUserClient.user);


	useEffect(() => {
		jCoursesApp.onLanguageChanged(_setLanguage);
		return () => { jCoursesApp.offLanguageChanged(_setLanguage) };
	},[]);

	const changeTranslation = () => (language:string) => setTranslation((text:string) => jCoursesApp.translate(text));
	
	useEffect(() => {
		jCoursesApp.onLanguageChanged(changeTranslation);
		return () => { jCoursesApp.offLanguageChanged(changeTranslation) };
	},[]);

	useEffect(() => {
		jUserClient.onUserChanged(setUser);
		return () => { jUserClient.offUserChanged(setUser) };
	},[]);

	const toggleSidebar = () => setShowsidebar(layoutStyle === "large" ? false :!showSidebar);
	const enableSideToggler = () => {
		setEnableSideToggler(true);
		setShowsidebar(false);
	}
	const disableSideToggler = () => {
		setEnableSideToggler(false);
		setShowsidebar(false);
	}

	const handleResize = () => {
		const layoutStyle = height < 600 ?
			width < 840 ? (width / height < 1.5 ? "narrow" : "short") : "short"
			:
			width < 840 ? "narrow" : "large";
		setLayoutStyle(layoutStyle);
	};

	useLayoutEffect(() => {
		handleResize();
	}, [width,height])

	return (
		<div ref={self} className="app">
			<ToastContainer autoClose={20000} position={toast.POSITION.BOTTOM_RIGHT} />
			<UIContexts
				setNavbarCustomItems={{ setNavbarCustomItems,enableSideToggler,disableSideToggler,setShowsidebar }}
				app={{ setLanguage,jCoursesClient,notifications }}
				showSidebar={showSidebar}
				appLayoutStyle={layoutStyle}
				language={language}
				translation={translation}
				user={user}
			>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Navigate to="/app" />}/>
						<Route path="/app" element={<Window sidebarEnabled={xenableSideToggler} toggleSidebar={toggleSidebar} navbarCustomItems={navbarCustomItems} setCourseControl={setCourseControl} jUserClient={jUserClient} />}>
							<Route index element={<Courses layoutStyle={layoutStyle} jCoursesClient={jCoursesClient} showSidebar={showSidebar} sidebarControls={{ enableSideToggler,disableSideToggler }} courseControl={courseControl} />}/>
							<Route path="register" element={<XRegister jUserClient={jUserClient} translate={translation} />}/>
							<Route path="login" element={<XLogin jUserClient={jUserClient} translate={translation} />}/>
							<Route path="activate" element={<XActivate jUserClient={jUserClient} translate={translation} />}/>
							<Route path="resetpassword" element={<XResetPassword jUserClient={jUserClient} translate={translation} />}/>
							<Route path="newpassword" element={<XNewPassword jUserClient={jUserClient} translate={translation} />}/>
							<Route path="usermanagement" element={<UserManagement jUserClient={jUserClient} translate={translation} />}/>
							<Route path="verifyemail" element={<XVerifyEmail jUserClient={jUserClient} translate={translation} />}/>
							<Route path="notfound" element={<NotFound />}/>
							<Route path="*" element={<Navigate to="notfound" />}/>
						</Route>
						<Route path="/*" element={<NotFound />}/>
					</Routes>
				</BrowserRouter>
			</UIContexts>
		</div>
	);
}

const Window = ({ sidebarEnabled,toggleSidebar,navbarCustomItems,setCourseControl,jUserClient }:any) => {
	const layoutStyle = useContext(AppLayoutStyleContext);
	const { setNavbarCustomItems } = useContext(NavbarContext);
	const t = useContext(TranslationContext);
	const user = useContext(UserContext);
	const [ navBarItems,setNavBarItems ] = useState<any[]>([]);
	const [ navbarPosition,setNavbarPosition ] = useState<string>("top");

	const handleLogout = () => {
		setCourseControl({ course:noCourse });
		jUserClient.logout();
	};

	useEffect(() => {
		setNavBarItems(
			[
				{ _id:111,Type:NavBarLink,data:{ to:"https://jarnontunnit.com",text:"jarnontunnit.com" } },
				{ _id:140,Type:NavBarLink,data:{ to:"/app",onClick:() => setCourseControl({ course:noCourse }),text:t("Courses") } },
				//{ _id:150,Type:NavBarLink,data:{ to:"/app/login",text:t("Login") } },
				//{ _id:160,Type:NavBarLink,data:{ to:"/app/logout",onClick:() => setCourseControl({ showItem:0 }),text:t("Logout") } },
				/*
				{
					_id : 120,
					Type : NavBarCollapsible,
					data : {
						itemList : [
							{ _id:140,Type:NavBarLink,data:{ to:"/courses",text:t("Courses") } },
							//{ _id:160,Type:NavBarAction,data:{ onClick:() => setLanguage("fi"),symbol:{ src:finnishFlag,alt:"Suomeksi/Finnish"} } },
							//{ _id:170,Type:NavBarAction,data:{ onClick:() => setLanguage("en"),symbol:{ src:englishFlag,alt:"English/Englanniksi"} } },
						],
						symbol : { src:menuIcon,alt:"Menu"},
					},
				},
				*/
			]
		);
	},[ t ]);

	useEffect(() => {
		setNavbarCustomItems(
			[
				...(user._id ?
					[
						{
							_id : 160,
							Type : NavBarLink,
							data : {
								to : "/app",
								onClick : handleLogout,
								text : t("Log out")
							},
						},
						{
							_id : 180,
							Type : NavBarLink,
							data : { to:"/app/usermanagement",text:t("settings") }
						},

					]
					:
					[
						{
							_id : 170,
							Type : NavBarLink,
							data : { to:"/app/register",text:t("Register") }
						},
						{
							_id : 150,
							Type : NavBarLink,
							data : { to:"/app/login",text:t("Log in") } 
						},
					]
				),
				
			]
		);
	},[ t,user ]);

	const toggleSidebarButton = [
		{
			_id : 301,
			Type : NavBarAction,
			data : {
				onClick : () => {
					toggleSidebar();
				},
				symbol : { src:menuIcon,alt:"Sisällysluettelo" },
			}
		},
	]

	// Todo: if language changes update text inside toast
	// --> for example close previous toast and open new one
	useEffect(() => {
		const termsAccepted = window.localStorage.getItem("termsAccepted");
		if (!(user._id || termsAccepted)) {
			const CloseButton = () => <button onClick={() => closeAcceptTerms()}>OK</button>
			const toastId = toast.info(t("$ terms"), {
				autoClose : false,
				closeOnClick : false,
				closeButton : CloseButton,
			});
			const closeAcceptTerms = () => {
				window.localStorage.setItem("termsAccepted","true");
				toast.dismiss(toastId);
			};
		}
	},[ t ]);

	useLayoutEffect(() => {
		const navbarPosition = layoutStyle === "short" ? "left" : "top";
		setNavbarPosition(navbarPosition);
	},[ layoutStyle ]);

	return (
		<>
			<NavBar position={navbarPosition} itemLists={[...((layoutStyle !== "large" && sidebarEnabled) ? [{ _id:300,itemList:toggleSidebarButton }]:[]),{ _id:100,itemList:navBarItems },{ _id:200,itemList:navbarCustomItems }]} layoutStyle={layoutStyle} />
			<div className={`japp-content japp-content-${layoutStyle}`}>
				<Outlet />
			</div>
		</>
	);
};

const XRegister = ({ jUserClient,translate }:any) => {
	const navigate = useNavigate();

	return <Register jUserClient={jUserClient} translate={translate} onSuccess={() => navigate(-1)} />;
};

const XLogin = ({ jUserClient,translate }:any) => {
	const navigate = useNavigate();

	return <Login jUserClient={jUserClient} translate={translate} onSuccess={() => navigate(-1)} onForgottenPassword={() =>  navigate("/app/resetpassword")} />;
};

const XResetPassword = ({ jUserClient,translate }:any) => {
	const navigate = useNavigate();

	return <ResetPassword jUserClient={jUserClient} translate={translate} onSuccess={() => navigate(-1)} />;
};

const XNewPassword = ({ jUserClient,translate }:any) => {
	const [ searchParams,setSearchParams ] = useSearchParams();

	return <NewPassword jUserClient={jUserClient} translate={translate} resetKey={searchParams.get("resetkey") || ""} />;
};

const XActivate = ({ jUserClient,translate }:any) => {
	const [ searchParams,setSearchParams ] = useSearchParams();

	return <Activate jUserClient={jUserClient} translate={translate} activationKey={searchParams.get("activationkey") || ""} />;
};

const XVerifyEmail = ({ jUserClient,translate }:any) => {
	const [ searchParams,setSearchParams ] = useSearchParams();

	return <VerifyEmail jUserClient={jUserClient} translate={translate} verificationKey={searchParams.get("verificationkey") || ""} />;
};



export default App;

/**

 */