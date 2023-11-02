import Joi from "joi";



const jDate = () => Joi.custom((value,helpers) => {
	console.log("<-> jjoi jDate")
	if(value.constructor === Date) return value;
	if(typeof value === "string") {
		try {
			console.log("<-> jjoi jDate - converting");
			return new Date(value);
		} catch(error:any) {
			return helpers.error("Invalid date");
		}
	}
	return helpers.error("Invalid date");
});



export default jDate;