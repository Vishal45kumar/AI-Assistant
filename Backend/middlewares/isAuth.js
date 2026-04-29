import jwt from "jsonwebtoken"
const isAuth = async(req,res,next) =>{
    //extract token from cookie
    try{
      //extract token from cookie
      const token = req.cookies.token;
      if (!token) {
        return res.status(402).json({
          messsage: "Token not found",
        });
      }
      // verify token with jwt secret and extract id from token (token contains userid and jwt secret)
      const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
      req.userId = verifyToken.userId
      next()
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"is Auth error"
        })
    }
}
export default isAuth