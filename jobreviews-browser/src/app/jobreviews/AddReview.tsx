import React,{ useState,useEffect,useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import Form,{ Button,RadioButtons,TextArea } from "jforms";
import { AppContext,TranslationContext,UserContext } from '../Contexts';
import { noWorkplace } from 'jobwarnings-shared';
import { matchExceptions } from "jexception";
import { InvalidRecaptchaException } from 'jrecaptcha';
import type { Workplace } from 'jobwarnings-shared';



const AddReviewLoad = () => {
	const navigate = useNavigate();
	const { _id } = useParams();
	const { jobReviews } = useContext(AppContext);
	const user = useContext(UserContext);
	const [ workplace,setWorkplace ] = useState<Workplace>(noWorkplace);

	const _initWorkplace = async() => {
		const workplace = await jobReviews.getWorkplace(_id);
		setWorkplace(workplace);
	};

	useEffect(() => {
		if(!user._id) return navigate("/app/login");
		_initWorkplace();
	},[]);

	return workplace._id && user._id ?
		<AddReview workplace={workplace} />
		:
		<div>Loading workplace ...</div>;
};

const AddReview = ({ workplace }:any) => {
	const navigate = useNavigate();
	const { jobReviews } = useContext(AppContext);
	const t = useContext(TranslationContext);

	const [ score,setScore ] = useState(0);
	const [ description,setDescription ] = useState("");
	const [ reCaptcha,setReCaptcha ] = useState(null);
	const [ reCaptchaError,setReCaptchaError ] = useState("");
	const [ error,setError ] = useState("");

	const onReCaptchaChance = (value:any) => {
		setReCaptcha(value);
	}

	const submit = async() => {
		setReCaptchaError("");
		setError("");
		try {
			await jobReviews.addReview({ workplace,score,description,reCaptcha });
			navigate("/app/reviewadded",{ replace:true });
		} catch(exception:any) {
			matchExceptions(exception,
				InvalidRecaptchaException, () => {setReCaptchaError(exception.message)},
				() => {setError(exception.message)},
			)
		}
	};

	const scores = [
		{ value:0,label:"0" },
		{ value:1,label:"1" },
		{ value:2,label:"2" },
		{ value:3,label:"3" },
		{ value:4,label:"4" },
		{ value:5,label:"5" },
	];

	return (
		<div>
			<h1>{t("Write your review")}</h1>
			<div>{workplace.name} – {workplace.locality.description}</div>
			<Form onSubmit={submit}>
				<RadioButtons name="score" label={t("Score")} choices={scores} onChange={setScore}/>
				<TextArea label={t("Review")} name="review" onChange={setDescription} />
				<ReCAPTCHA onChange={onReCaptchaChance} sitekey={jobReviews.reCaptchaId}/>
				{reCaptchaError && <div className="jform-error">{t(reCaptchaError)}</div>}
				{error && <div className="jform-error">{t(error)}</div>}
				<Button>{t("Submit")}</Button>
			</Form>
		</div>
	);
};



export default AddReviewLoad;
