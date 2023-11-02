import i18next from "i18next";
import type { i18n } from "i18next";



class J18Next {
	_i18next:i18n
	_supportedLanguages:string[];
	_resources:any;
	t:Translate; // this changes every time language is changed (for react)

	constructor(translations:any,LanguageDetector:any=null) {
		this._i18next = i18next.createInstance()
		LanguageDetector && this._i18next.use(LanguageDetector)
		const _translations = Array.isArray(translations) ? translations : [ translations ];
		this._supportedLanguages = _translations[0].languages;
		this._resources = {};
		// read and process translations files to standard i18next format
		for(const { languages,translations } of _translations) {
			for(const language of languages) {
				if(!this._resources[language]) this._resources[language] = { translation:{} };
			}
			const languageEntries = [ ...languages.entries() ];
			for(const [ dev,trans ] of Object.entries(translations)) {
				for(const [ index,language ] of languageEntries) {
					//@ts-ignore
					this._resources[language].translation[dev] = trans[index];
				}
			}
		}
		// for react
		this.t = Object.assign(
			(text:string) => this.translate(text),
			{ date:this.date },
		);
	}

	init = async(settings:Object={}) => {
		await this._i18next.init({
			resources : this._resources,
			fallbackLng : this._supportedLanguages,
			supportedLngs : this._supportedLanguages,
			interpolation: {
				escapeValue : false // react already safes from xss
			},
			...settings
		});
	};

	get language() {return this._i18next.language}
	get languages() {return this._i18next.languages}
	get supportedLanguages() {return this._supportedLanguages}

	onLanguageChanged = (callback:(language:string)=>void) => this._i18next.on("languageChanged",callback);
	offLanguageChanged = (callback:(language:string)=>void) => this._i18next.off("languageChanged",callback);

	setLanguage = (language:string) => {
		// for react, to trigger rerendering of translated components
		this.t = Object.assign(
			(text:string) => this.translate(text),
			{ date:this.date },
		);
		this._i18next.changeLanguage(language);
	}
	
	getLanguage = () => this._i18next.language;
	
	getLanguages = () => this._i18next.languages;

	translate = (text:string) => this._i18next.t(text);

	date = (date:Date) => {
		const result = date.toLocaleDateString(this._i18next.language,{
			year : 'numeric',
			month : 'numeric',
			day : 'numeric',
		});
		return result;
	};
}

interface Translate {
	(text:String):string;
	date:(date:Date)=>string;
};



export default J18Next;
export { J18Next };
