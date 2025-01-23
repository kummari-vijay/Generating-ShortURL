const mongoose=require("mongoose")
const shortid=require("shortid")

const urls=new mongoose.Schema({
     fullurl : {
     type : String ,
     require : true,
     unique : true,
     },
     shortid : {
        type : String,
        require : true,
        default : shortid.generate
     },
     clicks : {
      type : Number,
      require : true,
      default : 0
     }
})

const shortids=mongoose.model("shorturlids",urls)
module.exports=shortids