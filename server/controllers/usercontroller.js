
const User=require('../models/UserModel')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const registerController=async(req,res)=>{
    try{
        console.log(req.body)
       const existingUser=await User.findOne({email:req.body.email});
       if(existingUser){
        return res.status(200).send({message:`User Already Exist`,success:false})
       }
       const password=req.body.password;
       const salt=await bcrypt.genSalt(10);
       const hashedPassword=await bcrypt.hash(password,salt);
       req.body.password=hashedPassword;
       const newUser=new User(req.body);
       await newUser.save();
       res.status(201).send({message:"Register Successfully",success:true});

    } catch(error){
        console.log(error)
        res.status(500).send({success:false,message:`register cotroller${error.message}`});
    }
};
//login callback 
const loginController=async(req,res)=>{
  try{
       const user=await User.findOne({email:req.body.email});
       if(!user){
        return res.status(200).send({message:'User not found',success:false})
       }
       const isMatch=await bcrypt.compare(req.body.password,user.password)
       if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Invalid Email or Password", success: false });
      }
       const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:  '1d'});
       
     res.status(200).send({message:'Login Success',success:true,token:token,name:user.name,email:user.email,userid:user._id});  
    }
  catch(error){
    console.log(error);
    res.status(500).send({message:`error in Login CTRL ${error.message}`})

  }

};



module.exports={registerController,loginController}