import User from "../models/user.model.js";
import AppError from "../utills/error.util.js";
import cloudinary from "cloudinary"

const cookieOptions = {
    maxAge: 7*24*60*60*1000, // 7 days
    httpOnly : true,
    secure: process.env.NODE_ENV === "production",
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

    if(req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder : 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });

            if(result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;


                // Remove file from server
             fs.rm(`uploads/${req.file.fileName}`)
            }
        }
        catch(err) {
            return next(
                new AppError(error || 'File not uploaded please try again', 500)
            )
        }
    }

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token',token, cookieOptions)

    res.status(200).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
};

const login = async(req,res,next) => {
    const {email ,password} = req.body;

    if(!email || !password) {
        return next(new AppError('all field are required', 400));
    }

    try {
        const user = await User.findOne({
            email
        }).select('+password');

        if(!user || !user.comparePassword(password)) {
            return next(new AppError('Invalid crediential',400));
        }

        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie('token',token,cookieOptions);

        res.status(200).json({
            success: true,
            data: user
        })
    }
    catch(err) {
       return next(new AppError(err.message,500));
    }
};

const logout = (req,res) => {
    res.cookie('token',null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    })
};

const getProfile = async (req,res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      res.status(200).json({
        success: true,
        message: 'User details',
        user
      })
  } catch (err) {
    return next(new AppError('failed to fetch profile detail',500));
  }

    
};

export  {
    register,
    login,
    logout,
    getProfile
}