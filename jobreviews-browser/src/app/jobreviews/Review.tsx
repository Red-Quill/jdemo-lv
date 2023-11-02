import React,{ useContext,useEffect,useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext,TranslationContext } from '../Contexts';
import Form,{ Button, RadioButtons,TextArea } from "jforms";
import type { Review as _Review } from 'jobwarnings-shared';
import ReCAPTCHA from 'react-google-recaptcha';



type ReviewPT = {
	review:_Review;
}

const Review = ({ review:{ review,workplace:{ workplaceId,name,locality } } }:ReviewPT) => {
	const t = useContext(TranslationContext);
	const [ showReport,setShowReport ] = useState(false);

	return (
		<div className="jobwarnings-review">
			<div className="jobwarnings-review-workplace">
				<NavLink to={`/app/workplace/${workplaceId}`}>{name} – {locality.description}</NavLink>
			</div>
			<Description review={review}/>
			<Button onClick={() => setShowReport(!showReport)}>{t("Report")}</Button>
			{showReport && <Report review={review}/>}
		</div>
	);
};

const ReviewWithoutWorkplace = ({ review }:ReviewPT) => {
	const t = useContext(TranslationContext);

	return (
		<div className="jobwarnings-review">
			<Description review={review}/>
		</div>
	);
};

type ReportPT = {
	review:_Review;
	onSubmitted?:Function;
}

const Report = ({ review,onSubmitted=()=>{} }:ReportPT) => {
	const { jobReviews } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const [ problemChoices,setProblemChoices ] = useState<Object[]>([]);
	const [ problem,setProblem ] = useState("spam");
	const [ description,setDescription ] = useState("");
	const [ reCaptcha,setReCaptcha ] = useState(null);
	const [ reCaptchaError,setReCaptchaError ] = useState("");

	const onReCaptchaChance = (value:any) => {
		setReCaptcha(value);
	}

	useEffect(()=>{
		setProblemChoices([ { value:"spam",label:t("It is spam") },{ value:"other",label:t("Something else") } ]);
	},[ t ])

	const onSubmit = async() => {
		console.log("Submitting report")
		await jobReviews.reportReview(review,problem,description,reCaptcha);
		onSubmitted();
	};

	return (
		<Form onSubmit={onSubmit}>
			<RadioButtons name="problem" label={t("What is wrong with this post?")} choices={problemChoices} onChange={setProblem}/>
			<TextArea name="description" label={t("Description?")} onChange={setDescription}/>
			<ReCAPTCHA onChange={onReCaptchaChance} sitekey={jobReviews.reCaptchaId}/>
			{reCaptchaError && <div className="jform-error">{t(reCaptchaError)}</div>}
			<Button>{t("submit")}</Button>
		</Form>
	);
};

const Description = ({ review:{ score,description,createdAt } }:ReviewPT) => {
	const t = useContext(TranslationContext);

	return (
		<div className="jobwarnings-review-description">
			<div>{t.date(createdAt)}</div>
			<div>{t("Score")}: {score}</div>
			<div>{description}</div>
		</div>
	);
};

type ReviewModeratorPT = {
	review:_Review;
	onDelete?:Function;
};

const ReviewModerator = ({ review:{ review,workplace:{ workplaceId,name,locality } },onDelete=()=>{} }:ReviewModeratorPT) => {
	const t = useContext(TranslationContext);
	const { jobReviews,notifications } = useContext(AppContext);

	const remove = async() => {
		const check = window.confirm("Are you sure?");
		if(!check) return;
		await jobReviews.deleteReview(review);
		console.log("Review removed");
		notifications.showNotification("Review removed");
		onDelete();
	};

	return (
		<div className="jobwarnings-review">
			<div className="jobwarnings-review-workplace">
				<NavLink to={`/app/workplace/${workplaceId}`}>{name} – {locality.description}</NavLink>
			</div>
			<Description review={review}/>
			<button onClick={remove}>Delete review</button>
		</div>
	);
};

type ReviewWaitingPT = {
	review:_Review;
	onDelete?:Function;
};

const ReviewWaiting = ({ review:{ review,workplace:{ workplaceId,name,locality } },onDelete=()=>{} }:ReviewWaitingPT) => {
	const { jobReviews,notifications } = useContext(AppContext);

	const remove = async() => {
		const check = window.confirm("Are you sure?");
		if(!check) return;
		await jobReviews.deleteReview(review);
		console.log("Review removed");
		notifications.showNotification("Review removed");
		onDelete();
	};

	const restore = async() => {
		const check = window.confirm("Are you sure?");
		if(!check) return;
		await jobReviews.deleteReviewAndBanUser(review);
		console.log("Review removed");
		notifications.showNotification("Review restored");
		onDelete();
	};

	const removeAndBanUser = async() => {
		const check = window.confirm("Are you sure?");
		if(!check) return;
		await jobReviews.restoreReview(review);
		console.log("Review removed and user banned");
		notifications.showNotification("Review removed and user banned");
		onDelete();
	};

	return (
		<div className="jobwarnings-review">
			<div className="jobwarnings-review-workplace">
				<NavLink to={`/app/workplace/${workplaceId}`}>{name} – {locality.description}</NavLink>
			</div>
			<Description review={review}/>
			<button onClick={remove}>Delete review</button>
			<button onClick={restore}>Restore review</button>
			<button onClick={removeAndBanUser}>Delete review and ban user</button>
		</div>
	);
};

const ReviewWithoutWorkplaceModerator = ({ review }:ReviewPT) => {
	const t = useContext(TranslationContext);
	const { jobReviews,notifications } = useContext(AppContext);

	const remove = async() => {
		const check = window.confirm("Are you sure?");
		if(!check) return;
		await jobReviews.deleteReview(review);
		console.log("Review removed");
		notifications.showNotification("Review removed");
	};
	
	return (
		<div className="jobwarnings-review">
			<Description review={review}/>
			<button onClick={remove}>Delete review</button>
		</div>
	);
};

type MyReviewPT = {
	review:_Review;
	onDelete?:Function;
};

const MyReview = ({ review:{ review,workplace:{ workplaceId,name,locality } },onDelete=()=>{} }:MyReviewPT) => {
	const t = useContext(TranslationContext);
	const { jobReviews,notifications } = useContext(AppContext);

	const remove = async() => {
		const check = window.confirm("Are you sure?");
		if(!check) return;
		await jobReviews.deleteMyReview(review);
		console.log("Review removed");
		notifications.showNotification("Review removed");
		onDelete();
	};

	return (
		<div className="jobwarnings-review">
			<div className="jobwarnings-review-workplace">
				<NavLink to={`/app/workplace/${workplaceId}`}>{name} – {locality.description}</NavLink>
			</div>
			<Description review={review}/>
			<button onClick={remove}>Delete review</button>
		</div>
	);
};



export default Review;
export { ReviewWithoutWorkplace,ReviewModerator,ReviewWithoutWorkplaceModerator,MyReview,ReviewWaiting };
