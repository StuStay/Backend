import express from 'express';
const router = express.Router();
import upload from '../middlewares/avatar-storage.js';
import userController from '../controllers/UserController.js';


router.post("/add", userController.add);
router.get('/all', userController.all);
router.delete("/destroy",userController.destroy);
router.get("/show",userController.show);

router.put('/profile', userController.updateProfile)
router.get('/search', userController.search)


router.post("/change-avatar", upload.single('image') , userController.changeAvatar);




export default router;
