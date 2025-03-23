import bcrypt from "bcrypt";
import connectDB from "../models/db";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";

export const signup = async (req:any, res:any) => {
    
  try {
    const {name, email, password} = req.body;
    connectDB();
    const userExist = await UserModel.findOne({email});
    console.log("reached here first");

    if (userExist) {
      return res.status(400).json({error: "Email already exists"});
    }
    console.log("reached here");
    const newUserModel = new UserModel({name, email, password})
    newUserModel.password = await bcrypt.hash(password, 10);
    await  newUserModel.save();
    res.status(201)
    .json({
        message: "Signup successfully",
        success: true
    })
  } catch (error) {
    res.status(500).json({message: "User not created" + error});
  }
};

export const login = async (req:any, res:any) => {
    
  try {
    const {email, password} = req.body;
    connectDB();
    const userDb = await UserModel.findOne({email});

    if(!userDb) {
      return res.status(400).json({error: "User not found"});
    }

    const isPassEqual = await bcrypt.compare(password, userDb.password);

    if(!isPassEqual) {
      return res.status(400).json({error: "Password is incorrect"});
    }

    const jwtToken = jwt.sign(
      { email: userDb.email, _id: userDb._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
  )

  res.status(200)
      .json({
          message: "Login Success",
          success: true,
          jwtToken,
          email,
          name: userDb.name
      })

    res.status(200).json({message: "Login successful"});
  } catch (error) {
    res.status(500).json({message: "Login failed" + error});
  }
};
