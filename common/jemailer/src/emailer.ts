import type { SendMailOptions } from "nodemailer";



class Emailer {
	init:()=>void;
	sendMail:(mailOptions:SendMailOptions)=>any;
};



export default Emailer;
