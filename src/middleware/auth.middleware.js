import { verifyToken } from '../lib/jwt.js';

export const protectRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { userId } = verifyToken(token);
      req.user = await User.findById(userId);
      if (!req.user) throw new Error('User not found');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else if (req.auth.userId) {
    try {
      req.user = await User.findOne({ clerkId: req.auth.userId });
      if (!req.user) throw new Error('User not found');
      next();
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    let email = req.user?.email;
    if (!email && req.auth.userId) {
      const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      email = clerkUser.primaryEmailAddress?.emailAddress;
    }
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    next(error);
  }
};