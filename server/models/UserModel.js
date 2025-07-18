const mongoose=require('mongoose')

const userSchema= new mongoose.Schema({
     name:{
        type:String,
        require:[true,'name is require']
  },
  email:{
        type:String,
        required:[true,"email is require"],
        unique:true

    },
    password:{
          type:String,
          required:[true,"password is require"],

    }
}, { timestamps: true })

module.exports= mongoose.model('User',userSchema)