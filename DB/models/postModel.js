import { model, Schema, } from 'mongoose';


const postSchema = new Schema({
    title: String,
    text: String,
    likes: [{
        type: String,
        ref: 'User',

    }],
    unlikes: [{
        type: String,
        ref: 'User',

    }],
    createdBy: {
        type: String,
        ref: 'User',
        required: true
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'   //parent child relationship
    }
    ,
    isDeleted: {
        type: Boolean,
        default: false
    },
    privacy: {
        type: String,
        enum: ['publicc', 'privatee'],
        default: 'publicc'
    }
},
    {
        timestamps: true
    });


const postModel = model.post || model('Post', postSchema);

export default postModel;


