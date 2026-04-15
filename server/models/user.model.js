import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
    fullName : {
        type : "String",
        required : [true, "Name is required"],
        minLength : [5,"Name must be at least 5 charchter"],
        maxLength : [50,"Name should be less than 50 charchter"],
        lowercase : true,
        trim : true
    },
    email : {
        type: "String",
        required: [true,"Email is required"],
        lowercase : true,
        trim : true,
        unique : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please fill in a valid email address',
        ]
    },
    password : {
        type : "String",
        required : [true, "Password is must required"],
        minLength : [8, 'Password must be at least 8 charchter'],
        select : false
    },
    avatar : {
        public_id : {
            type : "String"
        },
        secure_url : {
            type : "String"
        }
    },
    role: {
        type: "String",
        enum : ['USER','ADMIN'],
        default : 'USER'
    },
    forgotPasswordToken : String,
    forgotPasswordExpiry : Date
}, { timeStamps: true });

const User = model('User',userSchema);

export default User;