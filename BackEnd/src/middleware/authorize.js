import jwt from 'jsonwebtoken';

const authorize = (roles = []) => {
  if (!Array.isArray(roles)) {
    roles = [roles]; // Convert single role to array for consistency
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the decoded role includes any of the roles specified
      if (roles.length && !roles.some(role => decoded.RoleName.includes(role))) {
        return res.status(403).json({ message: 'Access Denied: You do not have correct privilege to perform this operation' });
      }

      // Attach the decoded user details to the request for further use
      req.user = decoded;
      next();
    } catch (ex) {
      console.error('Error verifying token:', ex);
      return res.status(400).json({ message: 'Invalid Token' });
    }
  };
};

export default authorize;
