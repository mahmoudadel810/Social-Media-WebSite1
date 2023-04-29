import { Router } from 'express';
import { asyncHandler } from '../../utils/errorHandling.js';
// import { validation } from '../../middelwares/validation.js';
import * as controller from './user.Controller.js';
import { auth } from '../../middelwares/Auth.js';
import { myMulter } from '../../services/Multer.js';
const router = Router();





router.patch('/profilePicture', auth(), myMulter({}).single('profilePicture'), asyncHandler(controller.profilePicture));
router.patch('/coverPicture', auth(), myMulter({}).array('coverPictures',2), asyncHandler(controller.coverPictures))







export default router;