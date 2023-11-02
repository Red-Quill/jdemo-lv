
class ErrorWhileHandlingException extends Error {
	error:any;
	exception:any;

	constructor(error:any,exception:any) {
		super(`Error: (${error}) while handling exception: (${exception})`);
		this.error = error;
		this.exception = exception;
	};
}

// types: single type or multiple types in array
const matchSingle = (exception:any,types:any[],callback:Function) => {
	const _types = Array.isArray(types) ? types : [ types ];
	for(const _type of _types) {
		if(exception instanceof _type) {
			const _ = callback()
			return [ true,_ ];
		}
	}
	return [ false,null ];
};

// types: single type or multiple types in array
const matchExceptions = (exception:any,...matchers:any[]) => {
	const len = matchers.length;
	try {
		for(let n=1;n<len;n+=2) {
			const [ match,_ ] = matchSingle(exception,matchers[n-1],matchers[n]);
			if(match) return _;
		}
		if(len % 2 === 1) {
			const _ = matchers[len-1]();
			return _;
		};
	} catch(error:any) {
		throw new ErrorWhileHandlingException(error,exception);
	}
	throw exception;
};



export default matchExceptions;
