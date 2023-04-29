import { Schema, model } from 'mongoose';

// Declare the Schema of the Mongo model
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
    replies: [{
        type: Schema.Types.ObjectId, //reply on Reply 
        ref: 'Reply'
    }],

}, {
    timestamps: true
});

const replyModel = model.reply || model('Reply', replySchema);

export default replyModel;