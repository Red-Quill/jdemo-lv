import fs from "node:fs/promises";
import { fromIni } from "@aws-sdk/credential-providers";
import { SSMClient,GetParameterCommand } from "@aws-sdk/client-ssm";



function mergeRecursive(targetObject, ...sourceObjects) {
	for(const sourceObject of sourceObjects) {
		Object.keys(sourceObject).forEach(function(key) {
			if (typeof sourceObject[key] === "object") {
				if (targetObject[key] === undefined) {
					targetObject[key] = {};
				}
				mergeRecursive(targetObject[key], sourceObject[key]);
			} else {
				targetObject[key] = sourceObject[key];
			}
		});
	}
	return targetObject;
};

const defaultConfig = {
	"server" : {
		"httpPort" : 3002
	},
	"database" : {
		"baseURL" : "localhost",
		"name" : "jdemo"
	},
	"blog" : {
		"postFilesPath" : "tmp/posts"
	},
	"courses" : {
		"courseFilesPath" : "tmp/courses"
	},
	"sessions" : {
		"jWTSigningKey" : "ace15665ff47861bbff46e443d453f0aa0e1e72d546803338ba80a2a8642df9d",
		"sessionFileStorePath" : "tmp/sessions"
	},
	"logger" : {
		"logFilesPath" : "tmp/log"
	}
};

// okay: read credentials from file and parse key id and secret key
const awsConfig = async() => {
	console.log("Configuring for AWS");
	const sSMclient = new SSMClient({
		credentials : fromIni({profile:'jt-dev-api-server-user'}), // explicit profile to use
		region : "us-east-1",
	});
	
	const awsConfigGetParameter = async(path) => {
		const command = new GetParameterCommand({ Name:path,WithDecryption:true });
		const response = await sSMclient.send(command);
		const value = response.Parameter.Value;
		return value;
	}

	const config = {
		server : {
			httpPort : 80,
		},
		/*
		database : {
			baseURL : await awsConfigGetParameter("/jt-dev-api/database/url"),
			name : await awsConfigGetParameter("/jt-dev-api/database/name"),
			username : await awsConfigGetParameter("/jt-dev-api/database/username"),
			password : await awsConfigGetParameter("/jt-dev-api/database/password"),
			useSsl : true,
			sslCAFilename : process.env.JCOURSES__DATABASE_SSLCAFILE,
		},
		*/
		courses : {
			courseFilesPath : await awsConfigGetParameter("/jt-dev-api/courses/coursefilespath"),
		},
		/*
		sessions : {
			jWTSigningKey : await awsConfigGetParameter("/jt-dev-api/sessions/jwt-signing-key"),
			sessionStorePath : await awsConfigGetParameter("/jt-dev-api/sessions/store-path"),
		},
		*/
		logger : {
			logFilesPath : process.env.JCOURSES__LOGGER_LOGFILESPATH || "log",
		},
	};

	return config;
}

const readDevelopmentConfigFile = async() => {
	try {
		return await fs.readFile(`development_config.json`);
	} catch(error) {
		return {};
	}
};

const developmentConfig = async() => {
	console.log("Configuring for development");
	const customConfigJSON = await readDevelopmentConfigFile();
	const customConfig = JSON.parse(customConfigJSON)
	const config = mergeRecursive({},defaultConfig,customConfig);
	return config;
};



const config = async() => {
	const configType = process.argv.includes("--development") ? "development" : "aws";
	switch(configType) {
		case "aws" : return await awsConfig();
		case "development" : return await developmentConfig();
		default : throw new Error(`Invalid configuration option: ${configType}`);
	}
};



export default config;
