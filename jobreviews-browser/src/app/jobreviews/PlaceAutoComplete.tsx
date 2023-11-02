import React,{ useContext } from 'react';
import { Input,Suggestions,Suggestion } from "jforms";
import usePlacesAutocomplete from "use-places-autocomplete";
import { MiscallaneousContext, TranslationContext } from '../Contexts';



const PlaceAutoComplete = ({ setSelected }:any) => {
	const googleMapsApiIsLoaded = useContext(MiscallaneousContext);
	const t = useContext(TranslationContext);
	const { ready,value,setValue,suggestions:{ status,data },clearSuggestions } = usePlacesAutocomplete({ requestOptions:{ types:[ "locality" ] } });
	
	const _setValue = (value:string) => {
		setValue(value);
		setSelected(null);
	};

	const _setSelected = (item:any) => {
		setSelected(item);
		setValue(item.description);
	}

	return (
		<>
			<Input label={t("Location")} name="city" onChange={_setValue} value={value}/>
			<Suggestions>
				{status === "OK" && data.map((item) => (
					<Suggestion key={item.place_id} item={item} value={item.description} onSelect={_setSelected}/>
				))}
			</Suggestions>
		</>
	);
};



export default PlaceAutoComplete;
