import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided or invalid format" });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token" });
    }
}



export const roleMiddleware = (roles) => {
    return (req, res, next) => {
     if(!roles.includes(req.userRole)){
         return res.status(403).json({message:"Access Denied"});
     }
     next()
    }
 }
