import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
}, { timestamps: true });

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods = {
    generateJWTToken: async function() {
        return await jwt.sign(
            {id: this._id, email: this.email,subscription: this.subscription,role: this.rol  },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    }
}
const User = model('User',userSchema);

export default User;