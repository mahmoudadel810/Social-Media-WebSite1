import { Schema,  model } from 'mongoose';

const commentSchema = new Schema({

    commentBody: {
        type: String,
        required: true
    },
    commentBy: { 
        type: String,
        ref: 'User',
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    replies: [{ //LLL
        type: String,  

        ref: 'Reply'
    }] 
},{
    timestamps: true
});

const commentModel = model.comment || model('Comment', commentSchema);

export default commentModel; 