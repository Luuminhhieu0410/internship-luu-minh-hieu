import morgan from "morgan"
import { createWriteStream } from "fs";
let accessLogStream = createWriteStream('access.log', { flags: 'a' });
let combinedMogan = morgan('combined', {
    stream: accessLogStream,
    // skip: (req, res) => {
    //     return res.statusCode > 400 // bỏ qua log file khi respone status code > 400 
    // }
})

let devMogan = morgan('dev');
let tinyMogan = morgan('tiny')
export {combinedMogan,devMogan,tinyMogan}



