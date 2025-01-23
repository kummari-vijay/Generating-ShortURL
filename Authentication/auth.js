function Authenticatinguser(req,res,next){
    const token=req.cookies.jwt
    console.log(token)
    if(!token) {
        res.json({msg:"user is unautherized"})
    }
    req.token=token
    next()
 }


 module.exports={Authenticatinguser}