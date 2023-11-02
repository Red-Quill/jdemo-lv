
const getIfModifiedSince = (request) => {
	const timeStamp = request.header("If-Modified-Since");
	const time = timeStamp ? Date.parse(timeStamp) : 0;
	return time;
};



export { getIfModifiedSince };
