import React,{ useContext } from 'react';
import Form,{ Input,Suggestions, Suggestion, Selections,Selection } from "jforms";
import usePlacesAutocomplete from "use-places-autocomplete";
import { LanguageContext, TranslationContext } from '../Contexts';
import type { Review as _Review } from 'jobwarnings-shared';



const PlacesAutoComplete = ({ localities,setLocalities }:any) => {
	const language = useContext(LanguageContext);

	return <PlacesAutoCompletex language={language} localities={localities} setLocalities={setLocalities}/>
};

// input disabled if !ready
const PlacesAutoCompletex = ({ localities,setLocalities,language }:any) => {
	const t = useContext(TranslationContext);
	const { ready,setValue,suggestions:{ status,data },clearSuggestions } = usePlacesAutocomplete({ requestOptions:{ types:[ "locality" ],language } });

	const addSelection = (item:any) => {
		if(localities.some((_item:any) => _item.place_id === item.place_id)) return;
		setLocalities([ ...localities,item ]);
	}

	const removeSelection = (item:any) => {
		const _selected = localities.filter((_item:any) => _item.place_id !== item.place_id);
		setLocalities(_selected);
	};

	return (
		<div>
			<SelectedLocalities localities={localities} ready={ready} onRemove={removeSelection}/>
			<Input label={t("Location")} name="place" onChange={setValue}/>
			<Suggestions>
				{status === "OK" && data.map((item) => (
					<Suggestion key={item.place_id} item={item} value={item.description} onSelect={addSelection}/>
				))}
			</Suggestions>
		</div>
	);
};

const SelectedLocalities = ({ localities,ready,onRemove }:any) => {
	const t = useContext(TranslationContext);

	if(!ready) return <div>{t("Waiting for google places service to load")}</div>
	if(localities.length === 0) return <div>{t("No locations selected")}</div>
	return (
		<Selections>
			{localities.map((item:any) => 
				<Selection key={item.place_id} item={item} value={item.description} onRemove={onRemove}/>
			)}
		</Selections>
	);
};



export default PlacesAutoComplete;
