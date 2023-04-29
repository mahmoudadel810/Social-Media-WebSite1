import userModel from "../../DB/models/userModel.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { tokenDecode } from "../utils/tokenFunction.js";

const authFunction = async (req, res, next) =>
{
    const { token } = req.headers;

    if (!token)
    {
        return next(new Error('Focus!! Enter Your Token', { status: 400 }));
    }
    if (!token.startsWith('Dola__'))
    {
        return next(new Error('Wrong Prefix', { status: 401 }));
    }
    const prefix = token.split('Dola__')[1];
    const decode = tokenDecode({ payload: prefix });
    
    if (!decode?._id)
    {
        return next(new Error('Fail To decode', { status: 400 }));
    }
    const user = await userModel.findById(decode._id, ' _id userName email ');
    
    if (!user)
    {
        return next(new Error('Fail To get User', { status: 400 }));
    }
    req.user = user;
    next();
};

export const auth = () =>
{
    return asyncHandler(authFunction);
};


//-----------------------------------authorization--------------------------------


