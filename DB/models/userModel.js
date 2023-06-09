import { Schema, model, } from "mongoose";
import bcrypt from 'bcryptjs';
import { nanoid } from "nanoid";

const userSchema = new Schema({
    firstName: String,
    lastName: String,

    email: {
        type: String,
        unique: true
    },

    password: String,
    userName: {
        type: String,
        unique: true,
        required: true
    },

    profile_Pic: String,
    profilePicPublicId: String,

    covers: [String],
    coverPublicIds: [String],

    isConfirmed: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: nanoid() //code not Null| with defult ,for security reasons
    },
    isloggedOut: {
        type: Boolean,
        default: false
    }


}, {
    timestamps: true
});

//hooks

userSchema.pre('save', function (next, doc) //hooks 
{
    this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUNDS);
    next();
});

const userModel = model.User || model('User', userSchema);

export default userModel;

