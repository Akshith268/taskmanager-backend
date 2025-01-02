const express= require('express');
const router = express.Router();
const CryptoJS=require('crypto-js');
const jwt=require('jsonwebtoken');
const User=require('../models/User');


router.post('/register',async(req,res)=>{
   console.log(req.body);
       try{
           const newuser=new User({
            username:req.body.username,
            email:req.body.email,
            password:CryptoJS.DES.encrypt(req.body.password,process.env.SECRET_KEY).toString()   
         })

          //  console.log(newuser);
          if(!newuser.username || !newuser.email || !newuser.password){
            return res.status(400).json({status:"error",message:"Please fill all the fields"});
            }
         const userexist=await User
         .findOne({email:newuser.email});
         if(userexist){
             return res.status(400).json({status:"error",message:"User already exists"});
          }
          if(req.body.password!==req.body.confirmpassword){
            return res.status(400).json({status:"error",message:"Passwords do not match!"});
          }

         const user=await newuser.save();
         console.log('USER:',newuser);
         return res.status(200).json({status:"ok",message:"User registered successfully!" });
       }
       catch{
         return res.status(500).json({status:"error",message:"some error occured!"});
       }
})


router.post('/login', async (req, res) => {
   try {
       const user = await User.findOne({
           email: req.body.email,
       });

       if (!user) {
           return res.status(404).json("User not found");
       }
         // console.log(user.email);
       const userpassword = CryptoJS.DES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

       if (userpassword !== req.body.password) {
           return res.status(400).json("Password is incorrect");
       }

       const accessToken = jwt.sign({
           id: user._id,
           isAdmin: user.isAdmin
       }, process.env.SECRET_KEY, { expiresIn: "5d" });

       const { password, ...others } = user._doc;
       return res.status(200).json({ ...others, accessToken,status:"ok" });
   } catch (error) {
       console.error(error);
       return res.status(500).json("Some error occurred");
   }
});


module.exports=router;