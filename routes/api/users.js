const express = require('express');
const router = express.Router();
const { auth } = require('../../middlewares/auth');
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} = require('../../controllers/usersCntrls');

const jsonParser = express.json();

router.post('/register', jsonParser, registerUser);
router.post('/login', jsonParser, loginUser);
router.post('/logout', auth, jsonParser, logoutUser);
router.get('/current', auth, jsonParser, currentUser);

module.exports = router;
