import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
   let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token failed" });
    }
};

// Role-based access control (Admin only)
const adminOnly = (req, res, next) => {
   if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};

export { protect, adminOnly };