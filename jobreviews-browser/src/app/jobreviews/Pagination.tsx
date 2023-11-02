import React from "react";



type PaginationPT = {
	pages:number;
	page:number;
	setPage:Function;
	itemsInPage:number;
	setItemsInPage:Function;
	itemsInPageChoices:number[];
	sortBy:string;
	sortByChoices:{ name:string,label?:string }[];
	setSortBy:Function;
	t?:Function;
};

const Pagination = ({ pages,page,setPage,itemsInPage,setItemsInPage,itemsInPageChoices,sortBy,sortByChoices,setSortBy,t=(_:string)=>_ }:PaginationPT) => {
	return (
		<div className="jpagination">
			<button className="jform-button" onClick={() => setPage(0)}>{t("First")}</button>
			<button className="jform-button" onClick={() => setPage(Math.max(0,page-1))}>{t("Previous")}</button>
			<span className="jpages-select">
				<select value={page} onChange={(event:any) => setPage(event.target.value)}>
					{[...Array(pages).keys()].map((z,index) => <option key={index} value={index}>{index+1}</option>)}
				</select>
				/{pages}
			</span>
			<button className="jform-button" onClick={() => setPage(Math.min(pages-1,page+1))}>{t("Next")}</button>
			<button className="jform-button" onClick={() => setPage(pages-1)}>{t("Last")}</button>
			<select className="jpages-select" value={itemsInPage} onChange={(event:any) => setItemsInPage(event.target.value)}>
				{itemsInPageChoices.map((value:number) => <option key={value} value={value}>{value}</option>)}
			</select>
			<select value={sortBy} onChange={(event:any) => setSortBy(event.target.value)}>
				{sortByChoices.map(({ name,label }) => <option key={name} value={name}>{label || name}</option>)}
			</select>
		</div>
	);
};



export default Pagination;



/*
itemsInPage
page

setItemsInPage
setPage
*/