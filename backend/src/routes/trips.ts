import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

router.get('/', authMiddleware, async (req: Request, res: Response) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let userResponse;

    try {
        userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: process.env.SUPABASE_ANON_KEY!,
            },
        });
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' });
    }

    const userData = await userResponse.json().catch(() => null);

    if (!userResponse.ok) {
        return res.status(401).json({ message: 'Invalid session' });
    }

    let tripsResponse;

    try {
        tripsResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/trips?user_id=eq.${userData.id}`,
            {
                headers: {
                    apikey: SUPABASE_SERVICE_ROLE_KEY!,
                    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                },
            }
        );
    } catch {
        return res.status(500).json({ message: 'Database unavailable' });
    }

    const trips = await tripsResponse.json().catch(() => null);

    if (!tripsResponse.ok) {
        return res.status(500).json({ message: 'Failed to fetch trips' });
    }

    return res.status(200).json(trips);
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {    
    const {
        departure_city,
        cities,
        days,
        people,
        budget,
    } = req.body;

    if (
        !departure_city ||
        !cities ||
        days == null ||
        people == null ||
        budget == null
    ) {
        return res.status(400).json({
            message: 'Please fill in all fields',
        });
    }

    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let userResponse;

    try {
        userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: process.env.SUPABASE_ANON_KEY!,
            },
        });
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' });
    }

    const userData = await userResponse.json().catch(() => null);

    if (!userResponse.ok) {
        return res.status(401).json({ message: 'Invalid session' });
    }

    let createResponse;

    try {
        createResponse = await fetch(`${SUPABASE_URL}/rest/v1/trips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_SERVICE_ROLE_KEY!,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                Prefer: 'return=representation',
            },
            body: JSON.stringify({
                user_id: userData.id,
                departure_city,
                is_public: false,
                cities,
                days,
                people,
                budget,
                likes: 0,
            }),
        });
    } catch {
        return res.status(500).json({ message: 'Database unavailable' });
    }

    const trip = await createResponse.json().catch(() => null);

    if (!createResponse.ok) {
        return res.status(createResponse.status).json({
            message: trip.message,
        });
    }

    return res.status(201).json(trip[0]);
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;

    const {
        departure_city,
        cities,
        days,
        people,
        budget,
    } = req.body;

    if (
        !departure_city ||
        !cities ||
        days == null ||
        people == null ||
        budget == null
    ) {
        return res.status(400).json({
            message: 'Please fill in all fields',
        });
    }

    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let userResponse;

    try {
        userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: process.env.SUPABASE_ANON_KEY!,
            },
        });
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' });
    }

    const userData = await userResponse.json().catch(() => null);

    if (!userResponse.ok) {
        return res.status(401).json({ message: 'Invalid session' });
    }

    let updateResponse;

    try {
        updateResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/trips?id=eq.${id}&user_id=eq.${userData.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: SUPABASE_SERVICE_ROLE_KEY!,
                    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    Prefer: 'return=representation',
                },
                body: JSON.stringify({
                    departure_city,
                    cities,
                    days,
                    people,
                    budget,
                }),
            }
        );
    } catch {
        return res.status(500).json({ message: 'Database unavailable' });
    }

    const trip = await updateResponse.json().catch(() => null);

    if (!updateResponse.ok) {
        return res.status(500).json({ message: 'Failed to update trip' });
    }

    return res.status(200).json(trip[0]);
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;

    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let userResponse;

    try {
        userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                apikey: process.env.SUPABASE_ANON_KEY!,
            },
        });
    } catch {
        return res.status(500).json({ message: 'Authentication service unavailable' });
    }

    const userData = await userResponse.json().catch(() => null);

    if (!userResponse.ok) {
        return res.status(401).json({ message: 'Invalid session' });
    }

    let deleteResponse;

    try {
        deleteResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/trips?id=eq.${id}&user_id=eq.${userData.id}`,
            {
                method: 'DELETE',
                headers: {
                    apikey: SUPABASE_SERVICE_ROLE_KEY!,
                    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                },
            }
        );
    } catch {
        return res.status(500).json({ message: 'Database unavailable' });
    }

    if (!deleteResponse.ok) {
        return res.status(500).json({ message: 'Failed to delete trip' });
    }

    return res.status(200).json({
        message: 'Trip deleted successfully',
    });
});

export default router;