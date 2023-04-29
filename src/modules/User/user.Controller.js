import userModel from "../../../DB/models/userModel.js";
import cloudinary from '../../utils/cloudinary.js';
import bcrypt from 'bcryptjs';



//======================================ProfilePicture================================================
// just one profile pic at once no duplicates are allowed

export const profilePicture = async (req, res, next) =>
{
    const { _id, userName } = req.user;

    if (!req.file)
    {
        next(new Error('You must provide Your Picture', { cause: 400 }));
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {

        folder: `profilePicture/${userName}`
    });
    const user = await userModel.findByIdAndUpdate(_id,
        {
            profile_Pic: secure_url,
            profilePicPublicId: public_id 
        });

    if (!user)
    {
        next(new Error('Please Login first ', { cause: 400 }));
    }
    const deletedData = await cloudinary.uploader.destroy(user.profilePicPublicId);//old pic addressnew:false
    // handle pic duplicates
    console.log(deletedData);

    return res.status(201).json({ message: 'Profile Uploaded Done' });
};

//========================================coverPictures================================================

export const coverPictures = async (req, res, next) =>
{
    const { _id, userName } = req.user;

    if (!req.files)
    {
        next(new Error('You must provide Your Picture', { cause: 400 }));
    }

    let images = [];
    let publicIds = [];


    for (const file of req.files)
    {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {

            folder: `coverPictures/${userName}`
        });

        images.push(secure_url);
        publicIds.push(public_id);
    }
    const user = await userModel.findByIdAndUpdate(_id,
        {
            covers: images,
            coverPublicIds: publicIds
        });

    if (!user)
    {
        next(new Error('You must Log In First', { cause: 400 }));
    }
    const data = await cloudinary.api.delete_resources(user.coverPublicIds);
    console.log(data);

    return res.status(201).json({ message: 'Done' });
};

