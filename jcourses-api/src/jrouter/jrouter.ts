import express from "express";
import type { Express,Router,Request,Response } from "express";
import JJoi from "jjoi";
import type { Schema } from "jjoi";



type RestHandler = (request:Request,response:Response,next?:Function) => Promise<void>|void;

type Method = {
	type: "expressRouter"|"subRouter"|"get"|"post"|"put";
	path:string;
	subRouter?:SubRouter;
	expressRouter?:Express;
	method?:RestHandler;
	validation?:Schema;
};

class _JRouter {
	_methods:Method[];
	_workers:any[]; // middleware

	constructor() {
		this._methods = [];
		this._workers = [];
	};

	useSubRouter = (path:string,subRouter:SubRouter) => {
		this._methods.push({ type:"subRouter",path,subRouter });
	};

	_prepareExpressRouter = (router:Express|Router,errorHandler:Function) => {
		for(const middleware of this._workers) {
			router.use(middleware);
		}

		for(const { type,path,validation,method,subRouter,expressRouter } of this._methods) {
			if(subRouter) {
				// @ts-ignore
				router.use(path,subRouter._getExpressSubRouter(errorHandler));
			} else if(expressRouter) {
				router.use(path,expressRouter);
			} else if(method) {
				const executor = methodExecutor(method,validation,errorHandler);
				switch(type) {
					// @ts-ignore
					case "get": return router.get(path,executor);
					// @ts-ignore
					case "post": return router.post(path,executor);
					// @ts-ignore
					case "put": return router.put(path,executor);
					default: throw new Error("Invalid on non-implemented rest method");
				}
			} else throw new Error("Fail");
		}
	};
};



class MainRouter extends _JRouter {
	_final:any;
	__errorHandler:any;

	constructor() {
		super();
		this._final = this.#defaultFinal;
		this.__errorHandler = this._defaultErrorHandler;
	};

	useWorker = (middleWare:any) => this._workers.push(middleWare);

	setFinal = (middleWare:any) => this._final = middleWare;

	#defaultFinal = (request:Request,response:Response) => response.status(404).send();

	_errorHandler = (request:Request,response:Response,error:any) => this.__errorHandler(request,response,error);

	setErrorHandler = (errorHandler:any) => this.__errorHandler = errorHandler;
	
	_defaultErrorHandler = (request:Request,response:Response,error:any) => {throw error};

	useExpressRouter = (path:string,expressRouter:Express) => this._methods.push({ type:"expressRouter",path,expressRouter });

	getExpressMainRouter = () => {
		const expressMainRouter = express();
		this._prepareExpressRouter(expressMainRouter,this._errorHandler);		
		expressMainRouter.use((request:Request,response:Response) => {
			try {
				this._final(request,response);
			} catch(error:any) {
				this._errorHandler(request,response,error);
			}
		});
		return expressMainRouter;
	};
};



class SubRouter extends _JRouter {

	constructor() {
		super();
	};

	useGetMethod = (path:string,validation:Schema,method:RestHandler) => this._methods.push({ type:"get",path,validation,method });

	usePutMethod = (path:string,validation:Schema,method:RestHandler) => this._methods.push({ type:"put",path,validation,method });

	usePostMethod = (path:string,validation:Schema,method:RestHandler) => this._methods.push({ type:"post",path,validation,method });

	_getExpressSubRouter = (parentErrorHandler:Function) => {
		const expressSubRouter = express.Router();
		this._prepareExpressRouter(expressSubRouter,parentErrorHandler);
		return expressSubRouter;
	};
};



const methodExecutor = (method:RestHandler,validation:Schema|undefined,errorHandler:Function) => {
	return validation ?
		methodExecutorWithValidation(method,validation,errorHandler)
		:
		methodExecutorWithoutValidation(method,errorHandler);
};

const methodExecutorWithoutValidation = (method:RestHandler,errorHandler:any) => {
	return async(request:Request,response:Response,next:Function) => {
		try {
			await method(request,response,next);
		} catch(error) {
			errorHandler(request,response,error);
		}
	};
};

const methodExecutorWithValidation = (method:RestHandler,validation:Schema,errorHandler:Function) => {
	return async(request:Request,response:Response,next:Function) => {
		try {
			const { error } = JJoi.validate(request,validation);
			if(error) {
				response.status(400).send("Invalid request");
				return;
			};
			await method(request,response,next);
		} catch(error) {
			errorHandler(request,response,error);
		}
	};
};



export { MainRouter,SubRouter };
