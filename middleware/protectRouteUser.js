import jwt from "jsonwebtoken";

export const protectRouteUser = (req, res, next) => {
    const token = req.cookies.tokenuser;
    if(!token) return res.status(401).json({success: false, message: "Unauthorized"})

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(!decoded) return res.status(401).json({success: false, message: "Token Invalido"})
        req.userId = decoded.userId
        next();

    } catch (error) {
        console.log("Error en verificacion de token", error);
        return res.status(500).json({success: false, message: "Server error"})
        
    }
    
}