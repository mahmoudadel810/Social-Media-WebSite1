import { connectionDB } from "../../DB/connection.js";
import * as allRouters from '../modules/index.Routes.js';
import { stackVar } from "./errorHandling.js";



export const initiateApp =
    (app, express) =>
    {
        const port = process.env.PORT || 3000;
        const baseUrl = process.env.BASE_URL;


        app.use(express.json());
        app.use(`${baseUrl}/user`, allRouters.userRouter);
        app.use(`${baseUrl}/auth`, allRouters.authRouter);
        app.use(`${baseUrl}/post`, allRouters.postRouter);
        app.use(`${baseUrl}/comment`, allRouters.commentRouter);

        //app.all ممكن تنحط ف اي مكان عكس التانيه مكان مهيا موجوده .
        app.use('*', ( req, res) =>
        {
            res.status(404).json({ message: 'In-Valid Routing' });
            
        });
        


        app.use((err, req, res, next) =>
        {
            if (err)
            {
                if (process.env.ENV_MODE == 'dev')
                {
                    console.log({err : err.message});
                    return res.status(err['cause'] || 500).json({ message: 'Fail  in Response', Error: err.message, stack: stackVar });
                    
                }
                return res.status(err['cause'] || 500).json({ message: 'Fail Response', Error: err.message });

            }
        });
        connectionDB();
        app.listen(port, () => { console.log(`Server Works Correct .....! on : ${port}`); });
    };
