import { Router } from 'express';
import { asyncHandler } from '../../utils/errorHandling.js';
// import { validation } from '../../middelwares/validation.js';
import * as controller from './comment.Controller.js';
import {auth }from '../../middelwares/Auth.js';
const router = Router();


//======================================commentRoutes=========================================
router.post('/addComment', auth(), asyncHandler(controller.addComment))
router.delete('/deleteComment/:commentId', auth(), asyncHandler(controller.deleteComment))


 
// =====================================replyRoutes===========================================


router.post('/replyOnComment', auth(), asyncHandler(controller.replyOnComment));
router.post('/replyOnReply', auth(), asyncHandler(controller.replyOnReply))


export default router;