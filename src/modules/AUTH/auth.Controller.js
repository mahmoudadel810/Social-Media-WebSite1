
import userModel from '../../../DB/models/userModel.js';
import { sendEmail } from '../../services/sendEmail.js';
import { tokenDecode, tokenGeneration } from '../../utils/tokenFunction.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';



//====================================signUP===================================================================

export const signUp = async (req, res, next) =>
{
    const { firstName, lastName, email, password, userName } = req.body;

    const userCheck = await userModel.findOne({ email }).select("_id email");
    if (userCheck)
    {
        return next(new Error('Email Already Exist', { cause: 409 }));
    }

    const newUser = new userModel({
        firstName, lastName, email, password, userName
    });
    const token = tokenGeneration({ payload: { newUser } });

    if (!token)
    {
        return next(new Error('Token Generation Fail', { cause: 400 }));
    }
    const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmLink/${token}`;


    const message = `<a href = ${confirmationLink}> Click To Confirm </a>`;

    const mailed = await sendEmail({
        to: email,
        message,
        subject: 'Confirmation Email '
    });
    if (!mailed)
    {
        return next(new Error('Fail While Sending Email !! ', { cause: 500 }));
    }

    res.status(201).json({ message: 'Sign Up Done ! please Now Confirm Your Email' });

};

//=====================================confirmationLink========================================================

export const confirmationLink = async (req, res, next) =>
{

    const { token } = req.params;
    const decode = tokenDecode({ payload: token });

    if (!decode?.newUser)
    {
        return next(new Error('token decode failed !', { cause: 400 }));
    }
    decode.newUser.isConfirmed = true;
    const confirmedUser = new userModel({ ...decode.newUser });
    await confirmedUser.save();
    res.status(200).json({ message: 'Confirmed Done', decode });
};

//=========================================Login–==============================================================

export const Login = async (req, res, next) =>
{
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, isConfirmed: true });

    if (!user)
    {
        return next(new Error('Some Thing Went Wrong ', { cause: 400 }));
    }

    const match = bcrypt.compareSync(password, user.password);


    if (!match)
    {
        return next(new Error('In-Valid Login Information', { cause: 400 }));
    }
    const token = tokenGeneration({ payload: { _id: user._id, email: user.email, userName: user.userName } });

    const loggedIn = await userModel.findOneAndUpdate({ email }, { isLoggedIn: true });


    if (!loggedIn)
    {
        return next(new Error('Please Login Again', { cause: 500 }));
    }
    res.status(201).json({ message: 'Login Success', token });
};
//===================================forgetPassword============================================================
export const forgetPassword = async (req, res, next) =>
{
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
    {
        return next(new Error('User Can Not Found', { cause: 404 }));
    }
    const code = nanoid(5);

    const emailed = await sendEmail({
        to: email,
        subject: 'Reset your Password',
        message: `your Password Reset code is : ${code}`
    });
    if (!emailed)
    {
        return next(new Error('Fail To Send Code !', { cause: 400 }));
    }
    user.code = code;
    await user.save();
    return res.status(200).json({ message: 'Code generated successfully.' });
};
//=========================================verifyCode================================================

export const verifyResetCode = async (req, res, next) =>
{

    const { code, newPassword, confirmNewPassword } = req.body; // confirm in validation

    const user = await userModel.findOne({ code });

    if (!user)
    {
        return next(new Error('In_valid code Provided', { cause: 404 }));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

    const updatedUser = await userModel.findOneAndUpdate(
        { _id: user._id },
        {
            $set: { password: hashedPassword, code: nanoid(5) }
        },
        { new: true }
    );
    res.status(201).json({ message: "Password updated successfully", updatedUser });
};
//====================================updatePassword===========================================================
export const updatePassword = async (req, res, next) =>
{
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById({ _id });

    if (!user)
    {
        return next(new Error('Please Login First ', { cause: 400 }));
    }
    const match = bcrypt.compareSync(oldPassword, user.password);

    if (!match)
    {
        return next(new Error('Wrong Old Password', { cause: 400 }));
    }
    const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

    const updated = await userModel.findByIdAndUpdate({ _id },
        {
            password: hashedPassword
        },
        { new: true });

    if (!updated)
    {
        return next(new Error('Can Not Update Your Password !', { cause: 400 }));
    }
    return res.status(201).json({ message: 'Password Updated Success', updated });
};

//========================================logOut================================================

export const logOut = async (req, res, next) =>
{
    const { _id, userName } = req.user;
    const user = await userModel.findOneAndUpdate({ _id, isloggedOut: false },
        {
            $set: {
                isloggedOut: true,
                isLoggedIn: false
            }
        },
        {
            new: true
        });
    if (!user)
    {
        return next(new Error('Can Not Log Out', { cause: 401 }));
    }
    res.status(200).json({ message: 'Logged Out Success' });
};



