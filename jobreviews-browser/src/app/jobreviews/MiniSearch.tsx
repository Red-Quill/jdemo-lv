import React,{ useState,useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Form,{ Input,Button } from "jforms";
import { TranslationContext } from '../Contexts';
import useSearchState from './searchState';
import PlacesAutoComplete from './PlacesAutoComplete';
import type { Review as _Review } from 'jobwarnings-shared';



// This WILL go to front page -> goes to Reviews page when user hits search
const MiniSearch = () => {
	const navigate = useNavigate();
	const [ a,b,updateSearch ] = useSearchState();

	const onSearch = (workplaceName:string,localities:any[]) => {
		console.log("--> onSearch");
		// @ts-ignore
		updateSearch({ workplaceName,localities,category:"reviews" });
		navigate("/app/reviews");
		console.log("<-- onSearch");
	};

	return (
		<div>
			<JobSearch onSearch={onSearch}/>
		</div>
	);
};



type JobSearchPT = {
	onSearch:Function;
}

const JobSearch = ({ onSearch }:JobSearchPT) => {
	const t = useContext(TranslationContext);
	const [ workplace,setWorkplace ] = useState("");
	const [ localities,setLocalities ] = useState<any[]>([]);

	const fetchReviews = async() => {
		onSearch(workplace,localities);
	};

	return (
		<Form onSubmit={fetchReviews}>
			<Input label={t("Workplace")} name="workplace" onChange={setWorkplace} />
			<PlacesAutoComplete localities={localities} setLocalities={setLocalities} />
			<Button>{t("Search")}</Button>
		</Form>
	);
};



export default MiniSearch;
