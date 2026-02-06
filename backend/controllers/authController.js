import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

   // Hardcoded Users for Demo
    const users = [
        { email: 'admin@ims.com', password: 'admin123', role: 'admin', name: 'Super Admin' },
        { email: 'viewer@ims.com', password: 'viewer123', role: 'viewer', name: 'Guest Viewer' }
    ];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign(
            { email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        res.json({ token, role: user.role, name: user.name });
    } else {
        res.status(401).json({ message: "Invalid Credentials" });
    }
};