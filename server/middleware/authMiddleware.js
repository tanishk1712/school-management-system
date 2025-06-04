import jwt from 'jsonwebtoken';
import School from '../models/School.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await School.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};