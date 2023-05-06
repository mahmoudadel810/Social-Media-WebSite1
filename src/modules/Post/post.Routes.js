import { Router } from 'express';
import { asyncHandler } from '../../utils/errorHandling.js';
// import { validation } from '../../middelwares/validation.js';
import * as controller from './post.Controller.js';
import * as validationSchemas from './post.validation.js';
import { auth } from '../../middelwares/Auth.js';
import { myMulter } from '../../services/Multer.js';
import { validation } from '../../middelwares/validation.js';
const router = Router();

//=================================================================================================
router.post('/addPost', auth(), validation(validationSchemas.addPostSchema), asyncHandler(controller.addPost));
router.put('/privatePost/:postId', auth(), asyncHandler(controller.privatePost));
router.get('/getPrivatePost', auth(), asyncHandler(controller.getPrivatePost));
router.get('/getAllPosts', asyncHandler(controller.getAllPosts));
router.get('/getMyPosts', auth(), asyncHandler(controller.getMyPosts));
router.delete('/deleteMyPost/:postId', auth(), asyncHandler(controller.deleteMyPost));
router.put('/updateMyPost/:postId', auth(), asyncHandler(controller.updateMyPost));
router.put('/likePost', auth(), asyncHandler(controller.likePost));
router.put('/unlikePost', auth(), asyncHandler(controller.unlikePost));



export default router;