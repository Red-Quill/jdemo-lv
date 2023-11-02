
const interrupt = () => {
	let _ = null;
	const interrupt:any = new Promise((resolve,reject) => {_ = resolve});
	interrupt.release = _;
	return interrupt;
};



export default interrupt;
