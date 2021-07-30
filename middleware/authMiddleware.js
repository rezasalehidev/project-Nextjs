const JWT = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    try {
        
        if (!req.headers.authorization) {
            return res.status(401).send("unAuthorization");
        }

     const {userId} = JWT.verify(req.headers.authorization,process.env.jwtSecret);
    
     req.userId = userId;

     next()

    } catch (error) {
       return res.status(401).send("unAuthorization");
    }
}