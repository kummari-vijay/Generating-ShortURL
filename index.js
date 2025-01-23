const express=require("express")
const mongoose=require("mongoose")
const cookieparser=require("cookie-parser")
const jwt=require("jsonwebtoken")
const shortid=require("shortid")
const userdata=require("./model/user")
const path=require("path")
const shorturlids=require("./model/urls")
const bcrypt=require("bcrypt")
const {Authenticatinguser}=require("./Authentication/auth")
const bodyparser=require("body-parser")
const {setuser}=require("./Authentication/auth")
const user = require("./model/user")


require('dotenv').config()

mongoose.connect("mongodb://localhost/userdata").then(()=>{console.log("connected sucessfully")})
.catch((error)=>{console.log(error)})


const app=express()
app.use(express.json())

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(cookieparser());


app.get("/",(req,res)=>{
   res.render("signup")
})



app.post("/signup",async(req,res)=>{
    try {
    const {name,email,password}=req.body;
    const userexists=await userdata.findOne({email : email})
    if(userexists){
     return res.redirect("/login")
    }
    else{
        const saltrounds=await bcrypt.genSalt(10);
        const hashpassword= await bcrypt.hash(password,saltrounds);
        await userdata.create({
        name,email,password : hashpassword,
    })}
   return res.redirect("/login")
   
} catch (error) {
    console.log(error)  
}
})


app.get("/login",(req,res)=>{
    return res.render("login")
})
app.post("/login",async (req,res)=>{
    try {
        const {email,password}=req.body;
        const emailexists=await userdata.findOne({email : email})
        if(!emailexists){
        return res.redirect("/signup")
        }
        const userpassword=await bcrypt.compare(password,emailexists.password)
        console.log(userpassword)
        if(userpassword){
        const user=process.env.USER_DETAILS

        const accessToken=jwt.sign({email : user}, process.env.JWT_SECRET_KEY,{expiresIn : '1d'})
        res.cookie("jwt" ,accessToken)
        return res.redirect("/shortid")
        }
        return res.render("login")
    } catch (error) {
        console.log(error)
    }
})



app.get("/shortid",Authenticatinguser,async(req,res)=>{
    jwt.verify(req.token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
           return  res.sendStatus("invalid token")
        }
       })
       const fullurl=await shorturlids.find({})
    return res.render('shortid',{fullurl : fullurl})
})


app.post("/shortid",Authenticatinguser,async(req,res)=>{
    try {
        jwt.verify(req.token,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err){
               return  res.sendStatus("invalid token")
            }
        })
        const {fullurl}=req.body;
        const urlexist=await shorturlids.findOne({fullurl : fullurl})
        if(urlexist){ 
        res.redirect("shortid")} 
        await shorturlids.create({fullurl : fullurl})
       return  res.redirect("/shortid")
    } catch (error) {
       console.log(error) 
    }
})


app.get("/:shortid",async(req,res)=>{
    const shortid=await shorturlids.findOne({shortid : req.params.shortid})
    console.log(shortid)
    if(shortid == null) return res.sendStatus(404)

    shortid.clicks++
    shortid.save()

    res.redirect(shortid.fullurl);
})

app.listen(process.env.PORT,()=>{
    console.log("server running successfully")
})
