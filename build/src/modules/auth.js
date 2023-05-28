import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();
export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};
export const hashPassword = (password, saltRound) => {
    return bcrypt.hash(password, saltRound);
};
export const createJWT = (user) => {
    const token = jwt.sign({
        id: user.id,
        role: user.role
    }, process.env.JWT_SECRET);
    return token;
};
export const loggedOn = (req, res, next) => {
    const bearer = req.headers.authorization || req.headers.Authorization;
    if (!bearer) {
        res.status(401);
        res.json({ message: "Tidak authorized" });
        return;
    }
    const [, token] = bearer.split(' ');
    if (!token) {
        res.status(401);
        res.json({ message: "Token tidak valid" });
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (e) {
        console.log(e);
        res.status(401);
        res.json({ message: "Tidak authorized" });
        return;
    }
};
//# sourceMappingURL=auth.js.map