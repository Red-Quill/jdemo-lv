import { SubRouter } from "../../jrouter/jrouter.js";



const googleregister = (userApi) => {
	const router = new SubRouter();
		
	router.usePostMethod("/",userApi.googleregister_validate,async(request,response) => {
		const { body,cookies } = await userApi.googleregister_POST(request);
		const { sessionId:{ value:sessionId },secureId:{ value:secureId,expires } } = cookies;
		response.cookie("sessionId",sessionId,{ secure:true,expires });
		response.cookie("secureId",secureId,{ secure:true,httpOnly:true,expires });
		response.send(body);
	});
	
	return router;
};



export default googleregister;


/*
 iss: 'https://accounts.google.com',
  azp: '426363859578-1oukb5ddn3t010sfrtfo0qqpu17abvu5.apps.googleusercontent.com',
  aud: '426363859578-1oukb5ddn3t010sfrtfo0qqpu17abvu5.apps.googleusercontent.com',
  sub: '101473537492578854378',
  email: 'jarnontunnit@gmail.com',
  email_verified: true,
  nbf: 1694811575,
  name: 'Jarno Parviainen',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocJ90Wr_zEJt0vDcwKzwC2YGjEwED5ENq4WF-BDFsVqSag=s96-c',
  given_name: 'Jarno',
  family_name: 'Parviainen',
  locale: 'en-GB',
  iat: 1694811875,
  exp: 1694815475,
  jti: 'a87a9a4b52286bb06ff5cd530c2035e7f3f799d3'

*/
