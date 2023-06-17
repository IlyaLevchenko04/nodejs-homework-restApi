const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const { SECRET_KEY, API_LINK } = process.env;
const { User } = require('../schemas/User');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');
const avatarsPath = path.resolve('public', 'avatars');
const { sendEmail } = require('../helpers/emailSender');

async function registerUser(req, res, next) {
  const { email, password } = req.body;
  const verificationCode = nanoid();
  try {
    const isEmailUnique = await User.findOne({ email: email });

    if (isEmailUnique) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const newUser = {
      email,
      password: hashedPassword,
      avatarURL,
      verificationCode,
    };

    const verificationEmail = {
      email,
      subject: 'Verification email',
      text: '',
      html: `<a target="_blank" href="${API_LINK}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
    };

    await User.create(newUser);

    await sendEmail(verificationEmail);

    return res
      .status(201)
      .json({
        user: {
          email: newUser.email,
          subscription: 'starter',
        },
      })
      .end();
  } catch (err) {
    console.log(err.message);
    next(err);
  }
}

async function verify(req, res, next) {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    return error;
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: '',
  });

  res.json({
    message: 'verify success',
  });
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;
  const user = User.findOne({ email });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    return error;
  }

  if (user.verify) {
    const error = new Error('User already verified');
    error.status = 400;
    return error;
  }

  const verificationEmail = {
    email,
    subject: 'Verification email',
    text: '',
    html: `<a target="_blank" href="${API_LINK}/api/auth/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  await sendEmail(verificationEmail);

  res.json({
    message: 'verify email sent',
  });
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    if (!user.verify) {
      return res.status(401).json({ message: 'Email isnt verified' });
    }

    const isPasswordTrue = await bcrypt.compare(password, user.password);

    if (!isPasswordTrue) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const { _id: id } = user;
    const payload = { id };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    await User.findByIdAndUpdate(id, { token });

    res.json({
      token: token,
      user: {
        email: email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function currentUser(req, res, next) {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
}

async function logoutUser(req, res, next) {
  const { _id: id } = req.user;

  await User.findByIdAndUpdate(id, { token: '' });

  res.json({ message: 'Logout success' });
}

async function uploadAvatar(req, res, next) {
  const { _id: id } = req.user;
  const oldPath = req.file.path;
  const filename = req.file.filename;
  const newPath = path.join(avatarsPath, filename);
  const avatarURL = path.join('avatars', filename);

  const image = await Jimp.read(oldPath);

  await image.resize(250, 250);

  await image.write(newPath);
  await fs.unlink(oldPath);
  const user = await User.findByIdAndUpdate(id, { avatarURL: avatarURL });

  res.json(user);
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  uploadAvatar,
  verify,
  resendVerifyEmail,
};
