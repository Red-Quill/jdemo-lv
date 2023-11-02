import React,{ createContext } from 'react';



const NavbarContext = createContext<any>(null);
NavbarContext.displayName = "NavbarContext";

const AppLayoutStyleContext = createContext<string>("narrow");
AppLayoutStyleContext.displayName = "AppLayoutStyleContext";

const LanguageContext = createContext<any>(null);
LanguageContext.displayName = "LanguageContext";

const TranslationContext = createContext<any>(null);
TranslationContext.displayName = "TranslationContext";

const UserContext = createContext<any>(null);
UserContext.displayName = "UserContext";

const AppContext = createContext<any>(null);
AppContext.displayName = "AppContext";

const GoogleMapsApiIsLoaded = createContext<boolean>(false);
AppContext.displayName = "MiscallaneousContext";

const UIContexts = ({ setNavbarCustomItems,appLayoutStyle,children,language,translation,user,app,googleMapsApiIsLoaded }:any) => (
	<NavbarContext.Provider value={setNavbarCustomItems}>
		<AppLayoutStyleContext.Provider value={appLayoutStyle}>
			<LanguageContext.Provider value={language}>
				<TranslationContext.Provider value={translation}>
					<UserContext.Provider value={user}>
						<AppContext.Provider value={app}>
							<GoogleMapsApiIsLoaded.Provider value={googleMapsApiIsLoaded}>
								{children}
							</GoogleMapsApiIsLoaded.Provider>
						</AppContext.Provider>
					</UserContext.Provider>
				</TranslationContext.Provider>
			</LanguageContext.Provider>
		</AppLayoutStyleContext.Provider>
	</NavbarContext.Provider>
);



export default UIContexts;
export { NavbarContext,AppLayoutStyleContext,LanguageContext,TranslationContext,UserContext,AppContext,GoogleMapsApiIsLoaded as MiscallaneousContext };
