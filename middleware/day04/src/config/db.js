import {createConnection} from 'mysql2';
import { config } from 'dotenv';
config();

try {
    var connection = await createConnection({
        database : process.env.DATABASE,
        host : process.env.HOST,
        user : process.env.USER,
        password : process.env.PASSWORD,
        port : process.env.PORT,
    })
    connection.connect((err) => {
        if(!err) return console.log('đã kết nối database');
        console.log(err);
    })
} catch (error) {
   console.log(error);
}
export default connection.promise();