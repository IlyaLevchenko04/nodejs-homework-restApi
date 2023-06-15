const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const { User } = require('../schemas/User');

async function registerUser(req, res, next) {
  const { email, password } = req.body;

  try {
    const isEmailUnique = await User.findOne({ email: email });

    if (isEmailUnique) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
    };

    await User.create(newUser);

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

async function loginUser(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Email or password is wrong' });
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
};