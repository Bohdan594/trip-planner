import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth'
import tripsRouter from './routes/trips'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/trips', tripsRouter)

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})