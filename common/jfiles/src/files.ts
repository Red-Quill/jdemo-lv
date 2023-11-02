import fs from "node:fs/promises";
import { resolve,relative,isAbsolute } from "node:path";



// limits access to _basePath and its subdirectories
class FileManager {
	_basePath:string;

	constructor(basePath:string) {
		this._basePath = resolve(basePath);
	};

	fullPath = (path:string) => {
		const absolutePath = resolve(`${this._basePath}/${path}`);
		const relativePath = relative(this._basePath,absolutePath);
		if(relativePath.startsWith('..') || isAbsolute(relativePath)) throw new Error(`File access denied`);
		return absolutePath
	};

	readFile = async(path:string) => {
		const fullPath = this.fullPath(path);
		const content = await fs.readFile(fullPath);
		return content;
	};

	readTextFile = async(path:string) => {
		const fullPath = this.fullPath(path);
		const content = await fs.readFile(fullPath,"utf-8");
		return content;
	};

	readFileNoError = async(path:string) => {
		const fullPath = this.fullPath(path);
		try {
			const content = await fs.readFile(fullPath);
			return content;
		} catch(error) {
			return "";
		}
	};

	readTextFileNoError = async(path:string) => {
		const fullPath = this.fullPath(path);
		try {
			const content = await fs.readFile(fullPath,"utf-8");
			return content;
		} catch(error) {
			return "";
		}
	};

	readDirectory = async(path:string="") => {
		const fullPath = this.fullPath(path);
		const files = await fs.readdir(fullPath);
		return files;
	};

	//TMP
	readDir = async(...args:any) => await this.readDirectory(...args);

	readJSONNoError = async(path:string) => {
		const json = await this.readTextFileNoError(path);
		if(!json) return null;
		const object = JSON.parse(json);
		return object;
	};

	readJSON = async(path:string) => {
		const fullPath = this.fullPath(path);
		const json = await fs.readFile(fullPath,"utf-8");
		const object = JSON.parse(json);
		return object;
	};

	writeTextFile = async(path:string,text:string) => {
		const fullPath = this.fullPath(path);
		await fs.writeFile(fullPath,text);
	};

	writeJSON = async(path:string,object:any) => {
		const fullPath = this.fullPath(path);
		const json = JSON.stringify(object)
		await fs.writeFile(fullPath,json);
	};

	removeFile = async(path:string,{ throwError=true,printError=false }:any={}) => {
		try {
			await fs.rm(this.fullPath(path));
		} catch(exception) {
			if(printError) console.log("Error when removing file (FileManager)",exception);
			if(throwError) throw exception;
		}
	};
};



export default FileManager;



/*
TODO:
write unit test for access validation. Ie. that parent directories cannot be accessed using FileManager

https://stackoverflow.com/questions/37521893/determine-if-a-path-is-subdirectory-of-another-in-node-js
//if(!relativePath || relativePath.startsWith('..') || isAbsolute(relativePath)) throw new Error("File access denied");

*/
