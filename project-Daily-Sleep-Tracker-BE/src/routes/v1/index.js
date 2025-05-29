/**lap_trinh_tich_hop_nang_cao_MERN_stack*/
import express from 'express'
import { userRoute } from './userRoute'
// import { sleepRoute } from './sleepRoute'

const Router = express.Router()

Router.get('/health', (req, res) => {
    res.json({
        message: 'Ready to use.',
    })
})

Router.use('/api/users', userRoute)
// Router.use('/api/sleep', sleepRoute)

export const APIs_v1 = Router
