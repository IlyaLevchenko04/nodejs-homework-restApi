const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/upload');
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  uploadAvatar,
} = require('../../controllers/usersCntrls');

const jsonParser = express.json();

router.post('/register', jsonParser, registerUser);
router.post('/login', jsonParser, loginUser);
router.post('/logout', auth, jsonParser, logoutUser);
router.get('/current', auth, jsonParser, currentUser);
router.patch('/avatars', upload.single('avatarURL'), auth, uploadAvatar);

module.exports = router;
