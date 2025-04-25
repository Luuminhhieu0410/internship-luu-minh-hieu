import { hash ,compare } from "bcrypt";
const saltRounds = 10;

export function hashPassword(password) {
    return new Promise((resolve,reject) => {
        hash(password,saltRounds,(err,encryptData) => {
            if(!err) resolve(encryptData);
            else reject(err);
        })
    })
}
export async function comparePassword(plainText, hashed) {
    let check = await compare(plainText, hashed);
    return check;
}
    