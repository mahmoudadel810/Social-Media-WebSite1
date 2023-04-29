let stackVar;
export const asyncHandler = (API) =>
{
    return (req, res, next) =>
    {
        API(req, res, next).catch((err) =>
        { 
            console.log({err: err.message});
            if (err.code == 11000)
            {
                return next(new Error('Email Already Exist', { cause: 409 }));
            }
            stackVar = err.stack;
            console.log({ err: err.message });
            console.log(stackVar);
            return next(new Error(err.message));
        });
    };
};

export { stackVar };
