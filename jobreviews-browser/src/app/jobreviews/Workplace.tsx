import React,{ useState,useEffect,useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AppContext, TranslationContext, UserContext } from '../Contexts';
import { Workplace as _Workplace,noWorkplace } from 'jobwarnings-shared';
import { ReviewWithoutWorkplace,ReviewWithoutWorkplaceModerator } from "./Review";
import type { Review } from "jobwarnings-shared";
import Pagination from './Pagination';



const WorkPlace = () => {
	const { _id } = useParams();
	const { jobReviews } = useContext(AppContext);
	const [ workplace,setWorkplace ] = useState<_Workplace>(noWorkplace);

	const _initWorkplace = async() => {
		const workplace = await jobReviews.getWorkplace(_id);
		setWorkplace(workplace);
	}

	useEffect(() => {
		_initWorkplace();
	},[]);

	return workplace._id ?
		<WorkPlaceInfo workplace={workplace} />
		:
		<div>Loading workplace ...</div>;
};

const WorkPlaceInfo = ({ workplace }:any) => {
	const { jobReviews } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const user = useContext(UserContext);

	const [ reviews,setReviews ] = useState<Review[]>([]);
	const [ page,setPage ] = useState(0);
	const [ itemsInPage,setItemsInPage ] = useState(10);
	const [ total,setTotal ] = useState(0);

	const [ sortByChoices,setSortByChoices ] = useState<{ name:string,label:string }[]>([])

	useEffect(() => {
		setSortByChoices([ { name:"newest",label:t("Newest_1")},{ name:"oldest",label:t("Oldest_1")},{ name:"best",label:t("Best_1")},{ name:"worst",label:t("Worst_1")} ]);
	},[ t ])

	const [ ReviewType,setReviewType ] = useState(() => ReviewWithoutWorkplace);

	useEffect(() => {
		setReviewType(() => user.admin ? ReviewWithoutWorkplaceModerator : ReviewWithoutWorkplace);
	},[ user ])

	// --> Sorting
	const [ sortBy,setSortBy ] = useState("newest");
	// <-- Sorting

	const _updateReviews = async() => {
		console.log("--> _updateReviews");
		const { reviews,total } = await jobReviews.searchWorkplaceReviews({
			workplace,
			sortBy,
			first : page*itemsInPage,
			last : (page+1)*itemsInPage,
		});
		setReviews(reviews);
		setTotal(total);
		console.log("<-- _updateReviews");
	};

	useEffect(() => {
		_updateReviews()
	},[ page,itemsInPage,sortBy ]);

	const onSlice = (page:number,itemsInPage:number) => {
		console.log("--> onSlice");
		setPage(page);
		setItemsInPage(itemsInPage);
		console.log("<-- onSlice");
	};

	const pagination = (
		<Pagination
			pages={Math.ceil(total/itemsInPage)}
			page={page}
			setPage={(page:number) => onSlice(page,itemsInPage)}
			itemsInPage={itemsInPage}
			setItemsInPage={(itemsInPage:number) => onSlice(page,itemsInPage)}
			itemsInPageChoices={itemsInPageChoices}
			sortBy={sortBy}
			setSortBy={setSortBy}
			sortByChoices={sortByChoices}
			t={t}
		/>
	);

	return (
		<div>
			<h1>{workplace.name} – {workplace.locality.description}</h1>
			<div>{t("Score")}: {workplace.workplaceStatistics.scoreAverage}</div>
			<div><NavLink to={`/app/addreview/${workplace._id}`}>{t("Add review")}</NavLink></div>
			{pagination}
			<div>
				{reviews.map((review) => <ReviewType key={review._id} review={review} />)}
			</div>
			{pagination}
		</div>
	);
};

const itemsInPageChoices = [ 10,50,100 ];



export default WorkPlace;
