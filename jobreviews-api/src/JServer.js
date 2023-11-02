import Api from "./api/api.js";
import DatabaseManager from "jmongodb";
import LogManager from "./logging/logManager.js";
import { Gmailer } from "jemailer";
import { wait } from "jutils";
import UserApi from "juser-service";
import JobReviewsApi from "./jobreviews/job-reviews-api.js";
//import JobReviewsApi from "./jobreviews/testa.js";



class JServer {
	_dataBaseManager;
	_userApi;
	_logManager;
	_emailer;
	_jApi;
	_listeners;
	_httpPort;
	_jobReviewsApi;

	constructor({ server,database,sessions,logger,authentication,email,users }) {
		this._listeners = {};
		this._logManager = new LogManager(logger);
		this._dataBaseManager = new DatabaseManager(database);
		this._userApi = new UserApi({ authentication,sessions,email,users });
		this._jobReviewsApi = new JobReviewsApi();
		this._emailer = new Gmailer(email);
		this._httpPort = server.httpPort;
	}

	// arguments are configuration objects
	init = async() => {
		try {
			await this._dataBaseManager.connect();
		} catch (error) {
			this._databaseStartLoop(); //async
		}
		await this._emailer.init();
		await this._userApi.init(this._dataBaseManager,this._emailer);
		await this._jobReviewsApi.init(this._dataBaseManager,this._userApi);
		this._jApi = new Api(this._logManager,this._userApi,this._jobReviewsApi);
		if(this._httpPort) this.listen(this._httpPort);
	};


	_databaseStartLoop = async() => {
		while(true) {
			console.log("Failed to connect to database, trying again in 30 seconds");
			await wait(30_000);
			try {
				await this._dataBaseManager.connect();
				break;
			} catch (error) {}
		}
	};

	listen = async(port) => {
		this._listeners[port] = this._jApi.listener(port);
		console.log(`Listening on port ${port}`);
		return this._listeners[port];
	};

	close = async(port) => {
		await this._listeners[port].close();
	};

	stop = async() => {
		for (listener of this._listeners)
			await listener.close();
		await this._dataBaseManager.disconnect();
	};
}



export default JServer;
