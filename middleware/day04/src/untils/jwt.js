import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config();
export function signToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h'
        }, (error, token) => {
            if (!error) resolve(token);
            else reject(error);
        })
    })
}