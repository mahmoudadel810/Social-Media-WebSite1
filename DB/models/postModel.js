import { model, Schema, } from 'mongoose';


// Declare the Schema of the Mongo model
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
        enum: ['publicc' , 'privatee'],
        default: 'publicc'
    }
},
    {
        timestamps: true
    });


const postModel = model.post || model('Post', postSchema);

export default postModel;



//hooks 

// postSchema.post('findOnAndUpdate', async function ()
// {
//     const { _id } = this.getQuery();
//     console.log({ data: this.getQuery(), id: _id });

//     const product = await this.model.findOne({ _id });
//     console.log(product);

//     product.totalVotes = product.likes.length - product.unlikes.length;
//     product.__v = product.__v + 1;
//     await product.save();




// });