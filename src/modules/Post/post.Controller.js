// import cloudinary from '../../utils/cloudinary.js';
import postModel from '../../../DB/models/postModel.js';

//======================================addPost================================================
export const addPost = async (req, res, next) =>
{
    const { title, text } = req.body;
    const { _id, userName } = req.user;
    const post = new postModel({
        title, text,
        createdBy: userName,

    });

    const savedPost = await post.save();


    if (!savedPost)
    {
        return next(new Error('Can Not add your Post', { cause: 404 }));

    }
    return res.status(201).json({ message: 'Post Added Success', savedPost });

};
//================================privatePost==========================================

export const privatePost = async (req, res, next) =>
{
    const { postId } = req.params;
    const { _id, userName } = req.user;

    const check = await postModel.findOne({ _id: postId });
    if (!check)
    {
        return res.status(404).json({ message: 'No Such Post Found' }); 
    }

    const post = await postModel.findOneAndUpdate({ _id: postId, createdBy: userName },
        {
            $set: {
                privacy: 'privatee',
            }

        },
        { new: true });

    if (!post)
    {
        return next(new Error('You Are Not Authorized To Make it Private', { cause: 401 }));
    }
    return res.status(201).json({ message: 'Post Now Private', post });
};
//======================================getPrivatePost================================

export const getPrivatePost = async (req, res, next) =>
{
    const{userName} = req.user
    const posts = await postModel.find({ createdBy: userName, privacy: 'privatee' }).select('_id title text privacy likes unlikes createdBy');

    if (!posts.length)
    {
        return next(new Error('You Have No Private Posts', { cause: 404 }));
    }
    res.status(201).json({ message: 'here is All Private Posts  ', posts });
};


//=====================================getAllPosts======================================

export const getAllPosts = async (req, res, next) =>
{

    const posts = await postModel.find({ privacy: { $ne: "privatee" } }).select('_id privacy title comments text likes unlikes createdBy');

    if (!posts.length)
    {
        return next(new Error('Can Not Show All Posts', { cause: 404 }));
    }
    res.status(201).json({ message: 'here is All  ', posts });
};

//===================================getMyPosts===================================================

export const getMyPosts = async (req, res, next) =>
{
    const { _id, userName } = req.user;
    const posts = await postModel.find({
        createdBy: userName,
        privacy: { $in: ["privatee", "publicc"] }
    }).select('_id privacy title text likes unlikes comments createdBy');

    if (!posts.length)
    {
        return next(new Error('Can Not Show Your Posts', { cause: 404 }));
    }

    res.status(201).json({ message: 'Here are Your Posts', posts });
};
//===================================deletePost======================================================

export const deleteMyPost = async (req, res, next) =>
{
    const { postId } = req.params;
    const { _id, userName } = req.user;

    const check = await postModel.findOne({ _id: postId });
    if (!check)
    {
        return res.status(404).json({ message: 'No Such Post Found' }); //Step for Handle Response
    }

    const post = await postModel.findOneAndDelete({ _id: postId, createdBy: userName });
    if (!post)
    {
        return next(new Error('You Are Not Authorized To Delete This Post', { cause: 401 }));
    }
    return res.status(201).json({ message: 'Post Deleted Success', post });
};

//===================================updatePost===================================================

export const updateMyPost = async (req, res, next) =>
{
    const { title, text } = req.body;
    const { postId } = req.params;
    const { _id, userName } = req.user;

    const check = await postModel.findOne({ _id: postId });
    if (!check)
    {
        return res.status(404).json({ message: 'No Such Post Found' }); //Step for Handle Response
    }

    const post = await postModel.findOneAndUpdate({ _id: postId, createdBy: userName },
        {
            $set: {
                title, text
            }

        }, { new: true });

    if (!post)
    {
        return next(new Error('You Are Not Authorized To Update This Post', { cause: 401 }));
    }
    return res.status(201).json({ message: 'Post Updated Success', post });
};

//=======================================likePost===============================================

export const likePost = async (req, res, next) =>
{
    const { _id , userName } = req.user;
    const { postId } = req.query;
    const post = await postModel.findOneAndUpdate({ _id: postId},
        {
            $pull: {
                unlikes: userName
            },
            $addToSet: {
                likes: userName
            }
        }, {
        new: true
    });
   

    if (!post)
    {
        return next(new Error('Some Thing Went Wrong !', { cause: 400 }));
    }

    res.status(201).json({ message: 'Post Liked', post });
};

//=======================================unlikePost===============================================

export const unlikePost = async (req, res, next) =>
{
    const { _id, userName } = req.user;
    const { postId } = req.query;

    const post = await postModel.findOneAndUpdate({ _id: postId},
        {
            $pull: {
                likes: userName
            },
            $addToSet: {
                unlikes: userName
            }
        }, {
        new: true
    });

    if (!post)
    {
        return next(new Error('Some Thing Went Wrong !', { cause: 400 }));
    }

    res.status(201).json({ message: 'Post Unliked', post });
};






