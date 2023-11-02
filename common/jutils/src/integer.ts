
// pseudo class for JSchema
class Integer {
	static isInteger = Number.isSafeInteger;
	static validate = Integer.isInteger;
};



export default Integer;
