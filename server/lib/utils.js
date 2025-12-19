
import jwt  from "jsonwebtoken";
//generate token
export const generatetoken = (userId
) =>{
    const token =  jwt.sign({userId},process.env.JWT_SECRET );
    return token;
}