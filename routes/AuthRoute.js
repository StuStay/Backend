import express from 'express';
const router = express.Router();

import upload from '../middlewares/upload.js';
import AuthController from '../controllers/AuthController.js';

router.post('/register', upload.single('avatar'), AuthController.register)
router.post('/login', AuthController.login)
router.get('/logout', AuthController.logout)
router.put('/forgot-password', AuthController.forgot_password)
router.put('/reset-password', AuthController.reset_password)
router.put('/changerMotDePasse', AuthController.changerMotDePasse)
router.post("/motDePasseOublie", AuthController.motDePasseOublie);

router.route("/forget").post(AuthController.SendCodeForgot);
router.route("/reset").post(AuthController.VerifCodeForgot);
router.route("/change").post(AuthController.ChangePasswordForgot);

    

export default router;
