import React,{ useState,useRef,useEffect,useContext,useLayoutEffect,Fragment, ReactNode } from 'react';
import {NavLink} from 'react-router-dom';
import Form,{ Input,Button,RadioButtons } from "jforms";
import { AppContext, MiscallaneousContext, TranslationContext, UserContext} from '../Contexts';
import Pagination from './Pagination';
import Review,{ ReviewModerator } from "./Review";
import useSearchState from './searchState';
import PlacesAutoComplete from './PlacesAutoComplete';
import type { Review as _Review,Workplace as _Workplace } from 'jobwarnings-shared';
import WorkplaceInfo from './WorkplaceInfo';



const JobReviews = () => {
	const { jobReviews } = useContext(AppContext);
	const googleMapsApiIsLoaded = useContext(MiscallaneousContext);
	const t = useContext(TranslationContext);
	const user = useContext(UserContext);

	const [ sortByChoices,setSortByChoices ] = useState<{ name:string,label:string }[]>([])

	useEffect(() => {
		setSortByChoices([ { name:"newest",label:t("Newest_1")},{ name:"oldest",label:t("Oldest_1")},{ name:"best",label:t("Best_1")},{ name:"worst",label:t("Worst_1")} ]);
	},[ t ])

	const [ ReviewType,setReviewType ] = useState(() => Review);

	useEffect(() => {
		setReviewType(() => user.admin ? ReviewModerator : Review);
	},[ user ])

	// @ts-ignore
	const [ { category,workplaceNameLowerCase,localities,page,itemsInPage,sortBy },search,updateSearch ] = useSearchState();

	// --> results
	const [ workplaces,setWorkplaces ] = useState<_Workplace[]>([]);
	const [ reviews,setReviews ] = useState<_Review[]>([]);
	const [ total,setTotal ] = useState(0);
	// <-- results

	const onSearch = (workplaceName:string,localities:any[],category:string) => {
		console.log("--> onSearch",workplaceName);
		// @ts-ignore
		updateSearch({ workplaceName,localities,category });
		console.log("<-- onSearch");
	};

	const onSlice = (page:number,itemsInPage:number) => {
		console.log("--> onSlice");
		// @ts-ignore
		updateSearch({ page,itemsInPage });
		console.log("<-- onSlice");
	};

	const _updateReviews = async() => {
		console.log("--> _updateReviews");
		const query = {
			workplaceNameLowerCase,
			localities,
			sortBy,
			first:page*itemsInPage,
			last:(page+1)*itemsInPage,
		};
		const { reviews,total } = await jobReviews.searchReviews(query);
		setWorkplaces([]);
		setReviews(reviews);
		setTotal(total);
		console.log("<-- _updateReviews");
	};

	const _updateWorkplaces = async() => {
		console.log("--> _updateWorkplaces");
		const query = {
			workplaceNameLowerCase,
			localities,
			sortBy,
			first:page*itemsInPage,
			last:(page+1)*itemsInPage,
		};
		const { workplaces,total } = await jobReviews.searchWorkplaces(query);
		console.log(workplaces);
		setWorkplaces(workplaces);
		setReviews([]);
		setTotal(total);
		console.log("<-- _updateWorkplaces");
	};

	useEffect(() => {
		console.log("useEffect triggered",category);
		category === "reviews" ?
			_updateReviews()
			:
			_updateWorkplaces();
	},[ search ]);

	const pagination = (
		<Pagination
			pages={Math.ceil(total/itemsInPage)}
			page={page}
			setPage={(page:number) => onSlice(page,itemsInPage)}
			itemsInPage={itemsInPage}
			setItemsInPage={(itemsInPage:number) => onSlice(page,itemsInPage)}
			itemsInPageChoices={itemsInPageChoices}
			sortBy={sortBy}
			// @ts-ignore
			setSortBy={(sortBy:string) => updateSearch({ sortBy })}
			sortByChoices={sortByChoices}
			t={t}
		/>
	);

	return (
		<div>
			<NavLink to="/app/newreview">{t("Add new review")}</NavLink>
			<div>
				<JobSearch onSearch={onSearch} search={search}/>
			</div>
			<div>
				{t("Total")}: {total} {t("results_1")}
			</div>
			{pagination}
			<div>
				{reviews.map((review:_Review) => <ReviewType key={review._id} review={review} />)}
				{workplaces.map((workplace) => <WorkplaceInfo key={workplace._id} workplace={workplace}/>)}
			</div>
			{pagination}
		</div>
	);
};

const itemsInPageChoices = [ 10,50,100 ];

type JobSearchPT = {
	onSearch:Function;
	search:any;
}

const JobSearch = ({ onSearch,search }:JobSearchPT) => {
	const t = useContext(TranslationContext);
	const [ category,setCategory ] = useState("reviews");
	const [ workplaceName,setWorkplaceName ] = useState("");
	const [ localities,setLocalities ] = useState<any[]>([]);
	const [ searchForChoices,setSearchForChoices ] = useState<any[]>([]);

	useEffect(() => {
		setCategory(search.category);
		setWorkplaceName(search.workplaceName);
		setLocalities(search.localities);
	},[]);

	useEffect(() => {
		setSearchForChoices([
			{ value:"reviews",label:t("Reviews_1") },
			{ value:"workplaces",label:t("Workplaces_1") },
		]);
	},[ t ]);

	const fetchReviews = async() => {
		onSearch(workplaceName,localities,category);
	};

	return (
		<Form onSubmit={fetchReviews}>
			<RadioButtons name="category" label={t("Search for")} choices={searchForChoices} initialChoice={category} onChange={(value:string) => setCategory(value)}/>
			<Input label={t("Workplace")} name="workplace" onChange={setWorkplaceName} value={workplaceName}/>
			<PlacesAutoComplete localities={localities} setLocalities={setLocalities} />
			<Button>{t("Search")}</Button>
		</Form>
	);
};



export default JobReviews;
