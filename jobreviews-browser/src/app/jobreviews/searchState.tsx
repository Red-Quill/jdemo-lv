import React,{ useEffect, useState } from "react";
import type { Review } from "jobwarnings-shared";



type search = {
	// --> search
	category:string;
	workplaceName:string;
	workplaceNameLowerCase:string;
	localities:any[];
	// <-- search

	// --> pagination
	page:number;
	itemsInPage:number;
	// <-- pagination

	// --> Sorting
	sortBy:string;
	// <-- Sorting

	// --> results
	//reviews:Review[];
	//total:number;
	// <-- results
};

type update = {
	// --> search
	category?:string;
	workplaceName?:string;
	workplaceNameLowerCase?:string;
	localities?:any[];
	// <-- search

	// --> pagination
	page?:number;
	itemsInPage?:number;
	// <-- pagination

	// --> Sorting
	sortBy?:string;
	// <-- Sorting

	// --> results
	//reviews?:Review[];
	//total?:number;
	// <-- results
};

let currentSearch:search = {
	category : "reviews",
	workplaceName : "",
	workplaceNameLowerCase : "",
	localities : [],
	page : 0,
	itemsInPage : 10,
	sortBy : "newest",
	//reviews : [],
	//total : 0,
};

const onChangeCallbacks = new Set<Function>();

const onChange = (callback:Function) => {
	onChangeCallbacks.add(callback);
};

const offChange = (callback:Function) => {
	onChangeCallbacks.delete(callback);
};

const updateSearch = ({ workplaceName,...update }:update) => {
	let changed = false;
	const newSearch = { ...currentSearch };
	if(workplaceName != null) {
		const workplaceNameLowerCase = workplaceName.toLowerCase();
		if(currentSearch.workplaceNameLowerCase !== workplaceNameLowerCase) {
			changed = true;
			newSearch.workplaceName = workplaceName;
			newSearch.workplaceNameLowerCase = workplaceNameLowerCase;
		}
	}
	for(const [ field,value ] of Object.entries(update)) {
		// @ts-ignore
		if(currentSearch[field] !== value) {
			// @ts-ignore
			newSearch[field] = value;
			changed = true;
		}
	}

	if(!changed) return;
	currentSearch = newSearch;

	for(const callback of onChangeCallbacks) {
		callback(currentSearch);
	}
};

const useSearchState = () => {
	const [ search,setSearch ] = useState<search>(currentSearch);

	useEffect(() => {
		onChange(setSearch);
		return () => {offChange(setSearch)};
	},[])

	return [ search,search,updateSearch ];
};



export default useSearchState;
