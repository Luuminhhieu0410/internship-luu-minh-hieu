import {createConnection} from 'mysql2';
import { config } from 'dotenv';
config();

try {
    // console.log('log ' + process.env.DATABASE,process.env.HOST);
    var connection = createConnection({
        database : process.env.DATABASE,
        host : process.env.HOST,
        user : process.env.USER,
        password : process.env.PASSWORD,
        port : process.env.PORT,
    
    })
} catch (error) {
   console.log(error);
}
export default connection.promise();