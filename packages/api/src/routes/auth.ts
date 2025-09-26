import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth';

const router: Router = Router();
const authController = new AuthController();

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.login);

// Register route
router.post('/register', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('role').isIn(['customer', 'admin', 'staff']).withMessage('Invalid role')
], authController.register);

// Logout route
router.post('/logout', [
  body('token').notEmpty().withMessage('Token is required')
], authController.logout);

export default router;
