import jwt from "jsonwebtoken"


//token is stored to ensure that when next time user logins it verifies with this token
const genToken = async(userId)=>{
    try{
        const token = await jwt.sign({userId},process.env.JWT_SECRET ,{expiresIn : "10d"})
        return token
    }catch(error){
        console.log(error);
    }
}

export default genToken