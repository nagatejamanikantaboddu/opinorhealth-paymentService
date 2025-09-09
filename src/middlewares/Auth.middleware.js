import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

const ALLOWED_ROLES = ['USER', 'ADMIN', 'DOCTOR'];

export const authorize = (...requiredRoles) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token.' });
    }

    const { userId, type } = decoded;

    if (!ALLOWED_ROLES.includes(type)) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: `Invalid role '${type}' in token.` });
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(type)) {
      return res.status(httpStatus.FORBIDDEN).json({ message: `Access denied for role: '${type}'.` });
    }

    // Attach minimal user info
    req.user = { id: userId, role: type };
    next();
  } catch (err) {
    console.error('Authorization Error:', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Authorization failed.' });
  }
};
