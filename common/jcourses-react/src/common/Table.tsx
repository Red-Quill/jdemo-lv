import React from "react";



type tableTypes = { headers:{ label:string,name:string }[],data:any[] };

// headers: [{name,*label,*sortable}]
// data: [{},{},...]
const Table = ({headers,data}:tableTypes) => (
	<table>
		<thead>
			<tr>
				{ headers.map( ({ label,name }) => <th key={label}>{name}</th>) }
			</tr>
		</thead>
		<tbody>
		{ data.map( (item) => (
			<tr key={item._id}>
				{ headers.map( ({ label }) => <td key={item._id + label}>{item[label]}</td> )}
			</tr>
		))}
		</tbody>
	</table>
);



export default Table;
