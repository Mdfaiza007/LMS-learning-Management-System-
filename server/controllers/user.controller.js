import User from "../models/user.model";
import AppError from "../utills/error.util";

const cookieOptions = {
    maxAge: 7*24*60*60*1000, // 7 days
    httpOnly : true,
    secure : true
}

const register = async(req,res,next) => {
    const {fullName,email,password} = req.body;

    if(!fullName || !email || !password) {
        return next(new AppError('All field are required',400));
    }

    const userExits = await User.findOne({email});

    if(userExits) {
        return next(new AppError('Email already exits',400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://res.cloudinary.com/ddcqtzjkx/image/upload/ar_1:1,c_crop,g_auto:face,w_300/r_max/co_rgb:68D2E7,e_outline:outer:15/main-sample.png'           
        }
    });

    if(!user) {
        return next(new AppError('User registration failed try again',400))
    }

    // file upload

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token',token, cookieOptions)

    res.status(200).json({
        success: true,
        message: 'User registered successfully',
        user,
    })
};

const login = (req,res) => {

};

const logout = (req,res) => {

};

const getProfile = (req,res) => {

};

export default {
    register,
    login,
    logout,
    getProfile
}