import React,{ createContext } from 'react';



const NavbarContext = createContext<any>(null);
NavbarContext.displayName = "NavbarContext";

const AppLayoutStyleContext = createContext<string>("narrow");
AppLayoutStyleContext.displayName = "AppLayoutStyleContext";

const SidebarShowContext = createContext<any>(null);
SidebarShowContext.displayName = "SidebarShowContext";

const LanguageContext = createContext<any>(null);
LanguageContext.displayName = "LanguageContext";

const TranslationContext = createContext<any>(null);
TranslationContext.displayName = "TranslationContext";

const UserContext = createContext<any>(null);
UserContext.displayName = "UserContext";

const AppContext = createContext<any>(null);
AppContext.displayName = "AppContext";

const UIContexts = ({ setNavbarCustomItems,appLayoutStyle,children,showSidebar,language,translation,user,app }:any) => (
	<NavbarContext.Provider value={setNavbarCustomItems}>
		<AppLayoutStyleContext.Provider value={appLayoutStyle}>
			<SidebarShowContext.Provider value={showSidebar}>
				<LanguageContext.Provider value={language}>
					<TranslationContext.Provider value={translation}>
						<UserContext.Provider value={user}>
							<AppContext.Provider value={app}>
								{children}
							</AppContext.Provider>
						</UserContext.Provider>
					</TranslationContext.Provider>
				</LanguageContext.Provider>
			</SidebarShowContext.Provider>
		</AppLayoutStyleContext.Provider>
	</NavbarContext.Provider>
);



export default UIContexts;
export { NavbarContext,AppLayoutStyleContext,SidebarShowContext,LanguageContext,TranslationContext,UserContext,AppContext };
