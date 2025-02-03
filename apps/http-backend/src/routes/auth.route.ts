import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router: express.Router = express.Router();
const authController = new AuthController();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

export { router as authRouter };
