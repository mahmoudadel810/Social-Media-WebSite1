import { Router } from 'express';
import { validation } from '../../middelwares/validation.js';
import { asyncHandler } from '../../utils/errorHandling.js';
import * as controller from './auth.Controller.js';
import * as validationSchemas from './auth.Validation.js';
import { auth } from '../../middelwares/Auth.js';

const router = Router();

router.post('/signUp', validation(validationSchemas.signUpSchema), asyncHandler(controller.signUp));
router.get('/confirmLink/:token', validation(validationSchemas.confirmEmailSchema), asyncHandler(controller.confirmationLink));
router.post('/Login', validation(validationSchemas.loginSchema), asyncHandler(controller.Login));
router.get('/forgetPassword', asyncHandler(controller.forgetPassword));
router.post('/verifyCode', validation(validationSchemas.forgetPasswordSchema), asyncHandler(controller.verifyResetCode));

router.post('/updatePassword', auth(), validation(validationSchemas.updatePasswordSchema), asyncHandler(controller.updatePassword));
router.put('/logOut', auth(), asyncHandler(controller.logOut));





export default router;