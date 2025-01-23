const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const express=require("express")
// const jwt=require("jsonwebtoken")

const userdata=new mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    email : {
      type : String,
      require : true,
      unique : true
    },
    password : {
        type : String,
        require : true,
    },
    isAdmin:{
        type : Boolean,
        deafault : false,
    }
    }
,{timestamps : true})

// userdata.pre("save",async function(next){
//     const password=this
//     console.log(password)
//     if(!password.isModified("password")){
//        next();
//     }
//     try {
//         const saltrounds= await bcrypt.genSalt(10)
//         const hashedpassword=await bcrypt.hash(password.password,saltrounds);
//         password.password=hashedpassword;
//     } catch (error) {
//         next(error)
//     }
// })

// userdata.methods.generateToken= async function(){
//     try {
//         const token=jwt.sign({
//             userid : this._id.toString(),
//             email : this.email,
//             isAdmin : this.isAdmin,
//         },
//         process.env.JWT_SECRET_KEY,
//         {
//         expiresIn : "30d",
//         }
//     ) 
//     return token
//     } catch (error) {
//         console.log(error)
//     }
// }

module.exports=mongoose.model("userdetails",userdata);