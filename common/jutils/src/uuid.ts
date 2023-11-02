
// pseudo class for JSchema
class UUID {
	static isUUID = (subject:any) => {
		return typeof subject === "string" && uuidPattern.test(subject);
	};

	static validate = UUID.isUUID;
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/



export default UUID;
