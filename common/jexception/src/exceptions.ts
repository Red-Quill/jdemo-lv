import Exception from "./exception.js";



// an optional global exceptions register
// used to communicate exceptions via rest api

type ExceptionClass = typeof Exception

const exceptions:{ [typeId:string]:ExceptionClass } = {
	[Exception.typeId] : Exception,
};

const registerException = (_Exception:ExceptionClass) => {
	const typeId = _Exception.typeId;
	if(exceptions[typeId]) {
		if(exceptions[typeId] === _Exception) return;
		throw new Error("TypeId conflict, exception is already registered with that typeId");
	}
	exceptions[typeId] = _Exception;
};

const getException = (typeId:string) => {
	if(!exceptions[typeId]) throw new Error("No exception registered with that typeId");
	return exceptions[typeId];
};

const getExceptionNoError = (typeId:string) => {
	return exceptions[typeId];
};



export { registerException,getException,getExceptionNoError };
