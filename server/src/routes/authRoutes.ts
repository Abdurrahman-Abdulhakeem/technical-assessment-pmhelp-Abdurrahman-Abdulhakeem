import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validation';
import { userValidation } from '../utils/validation';
import { protect } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/register', authLimiter, validate(userValidation.register), AuthController.register);
router.post('/login', authLimiter, validate(userValidation.login), AuthController.login);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getMe);
router.patch('/update-profile', validate(userValidation.updateProfile), AuthController.updateProfile);

export default router;