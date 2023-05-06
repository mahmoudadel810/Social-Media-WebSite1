import { Schema, model } from 'mongoose';

const replySchema = new Schema({
    replyBody: {
        type: String,
        required: true
    },
    replyBy: {
        type: String,
        ref: 'User',
        required: true
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    replies: [{//reply on Reply
        type: Schema.Types.ObjectId,  
        ref: 'Reply'
    }],

}, {
    timestamps: true
});

const replyModel = model.reply || model('Reply', replySchema);

export default replyModel;