import React,{ useState,useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha"
import Form,{ Input,TextArea,Button,RadioButtons } from "jforms";
import { AppContext,TranslationContext,UserContext } from '../Contexts';
import { matchExceptions } from "jexception";
import { InvalidRecaptchaException } from 'jrecaptcha';
import PlaceAutoComplete from './PlaceAutoComplete';



const NewReviewLoad = () => {
	const navigate = useNavigate();
	const user = useContext(UserContext);

	useEffect(() => {
		if(!user._id) navigate("/app/login");
	},[]);

	return user._id ?
		<NewReview />
		:
		<div>You need to login to add a new review ...</div>;
}

// new review for new workplace
const NewReview = () => {
	const navigate = useNavigate();
	const { jobReviews } = useContext(AppContext);
	const t = useContext(TranslationContext);
	const [ workplaceName,setWorkplaceName ] = useState("");
	const [ locality,setLocality ] = useState<any>(null);
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
			await jobReviews.newReview({ workplaceName,locality,score,description,reCaptcha });
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

	useEffect(() => {
		
	},[]);

	return (
		<div>
			<h1>{t("Write your review")}</h1>
			<Form onSubmit={submit}>
				<Input label={t("Workplace")} name="workplace" onChange={setWorkplaceName} />
				<PlaceAutoComplete setSelected={setLocality}/>
				<RadioButtons label={t("Score")} name="score" choices={scores} onChange={setScore}/>
				<TextArea label={t("Review")} name="review" onChange={setDescription} />
				<ReCAPTCHA onChange={onReCaptchaChance} sitekey={jobReviews.reCaptchaId}/>
				{reCaptchaError && <div className="jform-error">{t(reCaptchaError)}</div>}
				{error && <div className="jform-error">{t(error)}</div>}
				<Button>{t("Submit")}</Button>
			</Form>
		</div>
	);
};



export default NewReviewLoad;
