import {appendFileSync} from "fs";

export default function logIpAddress(req,res,next){
    appendFileSync('./access.log',req.ip +'' +'\n','utf-8');
    next();
}