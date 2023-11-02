import React,{ useState,useRef,useEffect,useContext,useLayoutEffect } from 'react';
import { Routes,Route,Navigate,BrowserRouter,Outlet,useNavigate, useSearchParams } from 'react-router-dom';

import "jforms/Form.scss";
import "./App.scss";

import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

import UIContexts,{ AppContext,AppLayoutStyleContext,NavbarContext,TranslationContext,UserContext } from './Contexts';
import useElementDimensions from './useElementDimensions';
import NavBar,{ NavBarLink,NavBarAction,NavBarCollapsible,NavBarDropdown } from "jnavbar-react";

import JobReviews from "./jobreviews/JobReviews";
import { Login,Register,Activate,ResetPassword,NewPassword,UserManagement,VerifyEmail } from "juser-react";

import NotFound from './NotFound';

import menuIcon from "../static/menu.svg";
import NewReview from './jobreviews/NewReview';
import Home from './jobreviews/Home';
import WorkPlaceInfo from './jobreviews/Workplace';
import AddReview from './jobreviews/AddReview';
import ReviewAdded from './jobreviews/ReviewAdded';

import SideAd from "./ads/SideAd";
import BottomAd from "./ads/BottomAd";

import finnishFlag from "../static/fi.svg";
import englishFlag from "../static/en.svg";

// @ts-ignore
import UilGlobe from "@iconscout/react-unicons/icons/uil-globe";
// @ts-ignore
import UilUser from "@iconscout/react-unicons/icons/uil-user-circle";
import MyReviewsPage from './jobreviews/MyReviews';
import WaitingReviewsPage from './jobreviews/moderation/WaitingReviews';
import TermsAndconditionsAndPrivacyPolicy from './legal/TermsAndConditionsAndPrivacyPolicy';



const App = ({ jobWarningsClient }:any) => {
	const { notifications,jUserClient,localization,jobReviews,googleClient } = jobWarningsClient;
	const { language:_language,onLanguageChanged,offLanguageChanged } = localization;
	const { user:_user } = jUserClient;

	const self = useRef<HTMLDivElement>(null);
	const [ width,height ] = useElementDimensions(self);
	const [ layoutStyle,setLayoutStyle ] = useState<string>("narrow");
	const [ navbarCustomItems,setNavbarCustomItems ] = useState([]);

	// -->
	const [ language,_setLanguage ] = useState<string>(_language);
	const [ t,setTranslation ] = useState(() => localization.t);
	const [ user,setUser ] = useState(_user);


	const [ googleMapsApiIsLoaded,setGoogleMapsApiIsLoaded ] = useState(googleClient.googleMapsApiIsLoaded);
	
	useEffect(() => {
		googleClient.onGoogleApiLoad(() => setGoogleMapsApiIsLoaded(true));
	},[])

	const _languageChange = (language:string) => {
		_setLanguage(language);
		setTranslation(() => localization.t);
	}

	useEffect(() => {
		onLanguageChanged(_languageChange);
		return () => { offLanguageChanged(_languageChange) };
	},[]);

	useEffect(() => {
		jUserClient.onUserChanged(setUser);
		return () => { jUserClient.offUserChanged(setUser) };
	},[]);

	const handleResize = () => {
		const layoutStyle = height < 600 ?
			width < 840 ? (width / height < 1.5 ? "narrow" : "short") : "short"
			:
			width < 840 ? "narrow" : "large";
		setLayoutStyle(layoutStyle);
	};

	useLayoutEffect(() => {
		handleResize();
	},[ width,height ])

	return (
		<div ref={self} className="app">
			<ToastContainer autoClose={20000} position={toast.POSITION.BOTTOM_RIGHT} />
			<UIContexts
				setNavbarCustomItems={{ setNavbarCustomItems }}
				app={{ jobReviews,jUserClient,localization,notifications,googleClient }}
				appLayoutStyle={layoutStyle}
				language={language}
				translation={t}
				user={user}
				googleMapsApiIsLoaded={googleMapsApiIsLoaded}
			>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Navigate to="/app" />}/>
						<Route path="/app" element={<Window navbarCustomItems={navbarCustomItems}/>}>
							<Route index element={<Home />}/>
							<Route path="reviews" element={<JobReviews />}/>
							<Route path="workplace/:_id" element={<WorkPlaceInfo />}/>
							<Route path="newreview" element={<NewReview />}/>
							<Route path="addreview/:_id" element={<AddReview />}/>
							<Route path="reviewadded" element={<ReviewAdded />}/>
							<Route path="myreviews" element={<MyReviewsPage />}/>
							<Route path="waitingreviews" element={<WaitingReviewsPage />}/>
							<Route path="register" element={<XRegister />}/>
							<Route path="login" element={<XLogin />}/>
							<Route path="activate" element={<XActivate />}/>
							<Route path="resetpassword" element={<XResetPassword />}/>
							<Route path="newpassword" element={<XNewPassword />}/>
							<Route path="usermanagement" element={<UserManagement jUserClient={jUserClient} t={t}/>}/>
							<Route path="verifyemail" element={<XVerifyEmail />}/>
							<Route path="terms" element={<TermsAndconditionsAndPrivacyPolicy />}/>
							<Route path="notfound" element={<NotFound />}/>
							<Route path="*" element={<Navigate to="notfound" />}/>
						</Route>
						<Route path="/*" element={<NotFound />}/>
					</Routes>
				</BrowserRouter>
				{layoutStyle !== "narrow" && <SideAd />}
				{layoutStyle !== "short" && <BottomAd />}
			</UIContexts>
		</div>
	);
}

const Window = ({ navbarCustomItems }:any) => {
	const { jUserClient,localization } = useContext(AppContext);
	const layoutStyle = useContext(AppLayoutStyleContext);
	const { setNavbarCustomItems } = useContext(NavbarContext);
	const t = useContext(TranslationContext);
	const user = useContext(UserContext);
	const [ navBarItems,setNavBarItems ] = useState<any[]>([]);
	const [ navbarPosition,setNavbarPosition ] = useState<string>("top");

	console.log(UilGlobe)

	const handleLogout = () => {
		jUserClient.logout();
	};

	useEffect(() => {
		setNavBarItems(
			[
				{ _id:111,Type:NavBarLink,data:{ to:"/app",text:"jobreviews.com" } },
				{ _id:140,Type:NavBarLink,data:{ to:"/app/reviews",text:t("Reviews") } },
				{
					_id : 120,
					Type : NavBarDropdown,
					data : {
						itemList : [
							{ _id:160,Type:NavBarAction,data:{ onClick:() => localization.setLanguage("fi"),symbol:{ src:finnishFlag,alt:"Suomeksi/Finnish"} } },
							{ _id:170,Type:NavBarAction,data:{ onClick:() => localization.setLanguage("en"),symbol:{ src:englishFlag,alt:"English/Englanniksi"} } },
						],
						symbol : { Component:UilGlobe,alt:"Menu",color:"white" },
					},
				},
				
			]
		);
	},[ t ]);

	useEffect(() => {
		setNavbarCustomItems(
			[
				...(user._id ?
					[
						{
							_id : 130,
							Type : NavBarDropdown,
							data : {
								symbol : { Component:UilUser,color:"white" },
								itemList : [
									{
										_id : 160,
										Type : NavBarLink,
										data : {
											to : "/app",
											onClick : handleLogout,
											text : t("Log out"),
										},
									},
									{
										_id : 180,
										Type : NavBarLink,
										data : { to:"/app/usermanagement",text:t("Settings") },
									},
									{
										_id : 190,
										Type : NavBarLink,
										data : { to:"/app/myreviews",text:t("My reviews") },
									},
									...(user.admin ? [ {
										_id : 191,
										Type : NavBarLink,
										data : { to:"/app/waitingreviews",text:t("Moderation") },
									}, ] : [])
								],
							},
						},
					]
					:
					[
						{
							_id : 140,
							Type : NavBarDropdown,
							data : {
								symbol : { Component:UilUser,color:"white" },
								itemList : [
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
								],							
							},
						},



					]
				),
				
			]
		);
	},[ t,user ]);

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
		<div className={`japp-window japp-window-${layoutStyle}`}>
			{/*<div className={`jnavbar-background jnavbar-background-${layoutStyle}`}></div>*/}
			<NavBar position={navbarPosition} itemLists={[{ _id:100,itemList:navBarItems },{ _id:200,itemList:navbarCustomItems }]} layoutStyle={layoutStyle} />
			<div className={`japp-content japp-content-${layoutStyle}`}>
				<Outlet />
			</div>
		</div>
	);
};



const XRegister = () => {
	const { jUserClient } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const navigate = useNavigate();

	return <Register jUserClient={jUserClient} translate={t} onSuccess={() => navigate(-1)} terms={<TermsAndconditionsAndPrivacyPolicy />} />;
};

const XLogin = () => {
	const { jUserClient } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const navigate = useNavigate();

	return <Login jUserClient={jUserClient} translate={t} onSuccess={() => navigate(-1)} onForgottenPassword={() =>  navigate("/app/resetpassword")} />;
};

const XResetPassword = () => {
	const { jUserClient } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const navigate = useNavigate();

	return <ResetPassword jUserClient={jUserClient} translate={t} onSuccess={() => navigate(-1)} />;
};

const XNewPassword = () => {
	const { jUserClient } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const [ searchParams,setSearchParams ] = useSearchParams();

	return <NewPassword jUserClient={jUserClient} translate={t} resetKey={searchParams.get("resetkey") || ""} />;
};

const XActivate = () => {
	const { jUserClient } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const [ searchParams,setSearchParams ] = useSearchParams();

	return <Activate jUserClient={jUserClient} translate={t} activationKey={searchParams.get("activationkey") || ""} />;
};

const XVerifyEmail = () => {
	const { jUserClient } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const [ searchParams,setSearchParams ] = useSearchParams();

	return <VerifyEmail jUserClient={jUserClient} translate={t} verificationKey={searchParams.get("verificationkey") || ""} />;
};



export default App;

/**

 */