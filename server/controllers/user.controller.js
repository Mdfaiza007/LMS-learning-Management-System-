import AppError from "../utills/error.util";

const register = (req,res,next) => {
    const {fullName,email,password} = req.body;

    if(!fullName || !email || !password) {
        return next(new AppError('All field are required',400));
    }
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