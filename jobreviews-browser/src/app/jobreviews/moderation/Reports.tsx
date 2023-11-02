import React,{ useState,useRef,useEffect,useContext,useLayoutEffect,Fragment, ReactNode } from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import Form,{ Input,Button,RadioButtons } from "jforms";
import { AppContext,MiscallaneousContext,TranslationContext,UserContext } from '../../Contexts';
//import Pagination from './Pagination';
//import Review,{ ReviewModerator,ReviewWaiting } from "./Review";
//import useSearchState from './searchState';
//import PlacesAutoComplete from './PlacesAutoComplete';
import type { Review as _Review,Workplace as _Workplace,JReport } from 'jobwarnings-shared';
//import WorkplaceInfo from './WorkplaceInfo';



const ReportsPage = () => {
	const user = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(()=>{
		if(!user.admin) navigate("/app",{ replace:true });
	},[ user ]);

	return user.admin ? <Reports /> : <div>Forbidden</div>;
};

const Reports = () => {
	const { jobReviews } = useContext(AppContext);
	const [ reports,setReports ] = useState<JReport[]>([]);
	const [ totalReports,setTotalReports ] = useState(0);

	const fetchReports = async() => {
		const { reports,total } = await jobReviews.getReports({ first:0,last:19 });
		setReports(reports);
		setTotalReports(total);
	};

	useEffect(()=>{
		fetchReports();
	},[]);

	const onOk = async(report:JReport) => {
		await jobReviews.restoreReview(report.review,"checked");
		fetchReports();
	};

	const onSafe = async(report:JReport) => {
		await jobReviews.restoreReview(report.review,"safe");
		fetchReports();
	};

	const onDelete = async(report:JReport) => {
		await jobReviews.deleteReview(report.review)
		fetchReports();
	};

	const onBan = async(report:JReport) => {
		await jobReviews.deleteReview(report.review)
		await jobReviews.banUser()
		fetchReports();
	};

	return (
		<div>
			<div>total: {totalReports}</div>
			{reports.map((report) => <Report report={report} onOk={onOk} onSafe={onSafe} onDelete={onDelete} onBan={onBan} />)}
		</div>
	);
};

type ReportPT = {
	report:JReport;
	onOk:Function;
	onSafe:Function;
	onDelete:Function;
	onBan:Function;
};

const Report = ({ report:{ problem,description,review } }:ReportPT) => {
	return (
		<div>
			<Review review={review} />
			<div>{problem}</div>
			<div>{description}</div>
			<button>Review is ok</button>
			<button>Review is safe</button>
			<button>Delete review</button>
			<button>Delete review and ban user</button>
		</div>
	);
};

type ReviewPT = {
	review:_Review;
}

const Review = ({ review:{ review,workplace:{ workplaceId,name,locality } } }:ReviewPT) => {
	return (
		<div className="jobwarnings-review">
			<div className="jobwarnings-review-workplace">
				<NavLink to={`/app/workplace/${workplaceId}`}>{name} – {locality.description}</NavLink>
			</div>
			<Description review={review}/>
		</div>
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



export default ReportsPage;
