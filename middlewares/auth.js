const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;
const { User } = require('../schemas/User');

async function auth(req, res, next) {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  try {
    if (bearer !== 'Bearer' || !token) {
      console.log('hello');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { auth };
