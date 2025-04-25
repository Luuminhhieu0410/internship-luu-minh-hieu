import morgan from "morgan"
import { createWriteStream } from "fs";
let accessLogStream = createWriteStream('access.log', { flags: 'a' });
let combinedMorgan = morgan('combined', {
    stream: accessLogStream,
    // skip: (req, res) => {
    //     return res.statusCode > 400 // bỏ qua log file khi respone status code > 400 
    // }
})

let devMorgan = morgan('dev');
let tinyMorgan = morgan('tiny')
export {combinedMorgan,devMorgan,tinyMorgan}

