import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*100, // MS
        httpOnly: true, // prevent XSS Attacks cross-site scripting attacks
        sameSite: "strict", // prevent CSRF Attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })
}