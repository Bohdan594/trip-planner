import { Request, Response, NextFunction } from 'express'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    next()
}