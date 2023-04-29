import commentModel from "../../../DB/models/commentModel.js";
import postModel from "../../../DB/models/postModel.js";
import replyModel from "../../../DB/models/replyModel.js";



export const addComment = async (req, res, next) =>
{
    const { commentBody, postId } = req.body;
    const { _id , userName } = req.user;

    const post = await postModel.findOne({ _id: postId });

    if (!post)
    {
        return next(new Error('Post not found', { cause: 400 }));
    }
    const comment = new commentModel({
        commentBody,
        postId,
        commentBy: userName
    });

    const savedComment = await comment.save();

    const check = await postModel.updateOne({ _id: postId },
        {
            $push: {
                comments: comment._id
            }
        });

    if (!check.modifiedCount)
    {
        return next(new Error('Push Failed', { cause: 400 }));
    }

    savedComment
        ? res.status(201).json({ message: 'Comment saved Success', savedComment })
        : res.status(400).json({ message: 'Unaple To make a Comment ' });
};

//===================================deleteComment================================================

export const deleteComment = async (req, res, next) =>
{
    const { commentId } = req.params;
    const { _id , userName } = req.user;

    const deletedComment = await commentModel.findByIdAndDelete({ _id: commentId, commentBy: userName });

    if (!deletedComment)
    {
        return next(new Error('Already Deleted OR Not Found !!!', { cause: 400 }));
    }
    const check = await postModel.updateOne({ _id: deletedComment.postId },
        {
            $pull: {
                comments: deletedComment._id
            }
        });

    if (!check.modifiedCount)
    {
        return next(new Error('Pulling failed', { cause: 400 }));
    }
    return res.status(200).json({ message: ' Deleted Done!' });
}

//====================================replyOnComment================================================-

export const replyOnComment = async (req, res, next) =>
{
    const { replyBody, commentId } = req.body;
    const { _id , userName} = req.user;  

    const comment = await commentModel.findById({ _id : commentId })
    
    if (!comment)
    {
        return next(new Error('In valid comment id ', { cause: 400 }));
    }
    const newreply = new replyModel({
        replyBody,
        commentId,
        replyBy: userName
    })
    const savedReply = await newreply.save()

    const check = await commentModel.updateOne({ _id: commentId },
        {
            $push: {
                replies: newreply._id
            }
        })
        
    if (!check.modifiedCount)
    {
        return next(new Error('pushing fail', { cause: 400 }))
    }
    return res.status(201).json({message :'You Replied On This Comment !' , savedReply})
}

//=====================================replyOnReply================================================

export const replyOnReply = async (req, res, next) =>
{
    const { replyBody, replyId } = req.body;
    const { _id , userName } = req.user;

    const comment = await replyModel.findById({ _id: replyId });

    if (!comment)
    {
        return next(new Error('In valid comment id ', { cause: 400 }));
    }
    const newReply = new replyModel({
        replyBody,
        replyId,
        replyBy: userName
    });
    const savedReply = await newReply.save();

    const check = await replyModel.updateOne({ _id: replyId },
        {
            $push: {
                replies: newReply._id
            }
        });

    if (!check.modifiedCount)
    {
        return next(new Error('pushing fail', { cause: 400 }));
    }
    return res.status(201).json({ message: 'You Replied On This Reply !', savedReply });
}




