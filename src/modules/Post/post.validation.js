import joi from 'joi';


export const addPostSchema = {
    body: joi.object().required().keys({
        title: joi.string().required(),
        text: joi.string().required()
    })
};

