import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

router.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    let response

    try{
        response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({ 
                email, 
                password,
                redirectTo: 'http://localhost:5173/verification'
            }),
        })
    }catch(err){
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }

    const data = await response.json().catch(() => null)

    if (response.ok && data?.identities?.length === 0) {
        return res.status(409).json({ message: 'User already exists' })
    }

    if (!response.ok) {
        const message = data?.error_description || data?.msg || data?.message || 'Something went wrong'
        return res.status(response.status).json({ message })
    }

    return res.status(201).json({ message: 'Check your email to confirm registration' })
})

router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' })
    }

    let response

    try{
        response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({ email, password }),
        })
    }catch{
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }

    const data = await response.json().catch(() => null)

    if (data?.error_code === 'invalid_credentials') {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    if (!response.ok) {
        const message = data?.error_description || data?.msg || data?.message || 'Something went wrong'
        return res.status(response.status).json({ message })
    }

    res.cookie('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 14 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({ message: 'Signed in successfully' })
})

router.post('/signout', (req: Request, res: Response) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    return res.status(200).json({ message: 'Signed out successfully' })
})

router.post('/refresh', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    let response

    try {
        response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        })
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        return res.status(401).json({ message: 'Session expired, please sign in again' })
    }

    res.cookie('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 14 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({ message: 'Token refreshed' })
})

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    let response

    try{
        response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: SUPABASE_ANON_KEY!,
            },
        })
    }catch{
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }
   
    const data = await response.json().catch(() => null)

    if (!response.ok) {
        return res.status(401).json({ message: 'Invalid session' })
    }

    return res.status(200).json(data)
})

router.post('/forgot-password', async (req: Request, res: Response) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: 'Email is required' })
    }

    let response

    try {
        response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY!,
            },
            body: JSON.stringify({
                email,
                redirectTo: 'http://localhost:5173/reset-password'
            }),
        })
    } catch (err) {
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }

    return res.status(200).json({ message: 'Check your email to reset password' })
})

router.post('/reset-password', async (req: Request, res: Response) => {
    const { password, accessToken } = req.body

    if (!password || !accessToken) {
        return res.status(400).json({ message: 'Password and token are required' })
    }

    let response

    try {
        response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ password }),
        })
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = data?.error_description || data?.msg || data?.message || 'Something went wrong'
        return res.status(response.status).json({ message })
    }

    return res.status(200).json({ message: 'Password updated successfully' })
})

router.delete('/delete-account', authMiddleware, async (req: Request, res: Response) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    let userResponse

    try {
        userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: SUPABASE_ANON_KEY!,
            },
        })
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }

    const userData = await userResponse.json().catch(() => null)

    if (!userResponse.ok) {
        return res.status(401).json({ message: 'Invalid session' })
    }

    const userId = userData.id

    let deleteResponse

    try {
        deleteResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            },
        })
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' })
    }

    if (!deleteResponse.ok) {
        const deleteData = await deleteResponse.json().catch(() => null)
        const message = deleteData?.error_description || deleteData?.msg || deleteData?.message || 'Something went wrong'
        return res.status(deleteResponse.status).json({ message })
    }

    res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    return res.status(200).json({ message: 'Account deleted successfully' })
})

export default router