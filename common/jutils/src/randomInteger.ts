import { randomInt } from "node:crypto";



const randomInteger = async(min:number,max:number):Promise<number> => {
	return await new Promise((resolve,reject) => {
		randomInt(min,max,(error:any,value:number) => error ? reject(error) : resolve(value));
	});
};



export default randomInteger;
