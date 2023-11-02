import React,{ useState,useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext,TranslationContext,UserContext} from '../Contexts';
import { MyReview } from "./Review";
import type { Review as _Review,Workplace as _Workplace } from 'jobwarnings-shared';



const MyReviewsPage = () => {
	const user = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(()=>{
		if(!user._id) navigate("/app",{ replace:true });
	},[ user ]);

	return user._id ? <MyReviews /> : <div>Forbidden</div>;
};

const MyReviews = () => {
	const { jobReviews } = useContext(AppContext);
	const t = useContext(TranslationContext);

	// --> results
	const [ reviews,setReviews ] = useState<_Review[]>([]);
	// <-- results

	const _updateReviews = async() => {
		console.log("--> _updateReviews");
		const myReviews = await jobReviews.myReviews();
		setReviews(myReviews);
		console.log("<-- _updateReviews");
	};

	useEffect(() => {
		console.log("useEffect triggered");
			_updateReviews()
	},[ ]);

	return (
		<div>
			<h1>{t("Your reviews")}</h1>
			<div>{t("Total")}: {reviews.length}</div>
			{reviews.map((review:_Review) => <MyReview key={review._id} review={review} onDelete={_updateReviews}/>)}
		</div>
	);
};



export default MyReviewsPage;
