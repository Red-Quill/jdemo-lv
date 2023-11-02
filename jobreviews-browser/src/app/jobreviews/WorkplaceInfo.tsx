import React,{ useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { TranslationContext } from '../Contexts';
import type { Workplace as _Workplace } from 'jobwarnings-shared';



type WorkplaceInfoPT = {
	workplace:_Workplace;
}

const WorkplaceInfo = ({ workplace:{ workplaceId,name,locality,workplaceStatistics:{ scoreAverage,totalReviews } } }:WorkplaceInfoPT) => {
	const t = useContext(TranslationContext);

	return (
		<div className="jobwarnings-review">
			<div className="jobwarnings-review-workplace">
				<NavLink to={`/app/workplace/${workplaceId}`}>{name} – {locality.description}</NavLink>
			</div>
			<div>{t("Score")}: {scoreAverage}</div>
			<div>{t("Reviews_1")}: {totalReviews}</div>
		</div>
	);
};



export default WorkplaceInfo;
