import jwt from 'jsonwebtoken';


const ensureAuthenticated = (req: any, res: any, next: any) => {

    const auth = req.headers['authorization'];

    if (!auth) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is require' });
    }

    const token = auth.split(" ")[1]; // Extract token after "Bearer "

    try {
        const decoded: any  = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Decoded Token Data:", decoded);
        req.user = decoded.email;
        next();
    } catch (err) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

export default ensureAuthenticated;
