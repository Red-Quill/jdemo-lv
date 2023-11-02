
type ExceptionOptions = { [key:string]:any };

class Exception {
	static typeId = "c705330e-e8fc-4414-bc5e-0bb86d57296d";
	cause = "Exception";
	info:string;
	message:string;
	options:ExceptionOptions;
	httpStatus?:number;

	constructor(info:string="",options:ExceptionOptions={}) {
		this.info = info;
		this.message = info ? `${this.cause}: ${info}` : this.cause;
		this.options = options;
	};

	// @ts-ignore
	get typeId() {return this.constructor.typeId}

	get _object() {
		const _object = {
			// @ts-ignore
			typeId : this.constructor.typeId,
			cause : this.cause,
			info : this.info,
			message : this.message,
			options : this.options,
		};
		return _object;
	}

	toString() {
		return this.message;
	}
};



export default Exception;
