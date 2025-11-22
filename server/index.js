import dotenv from 'dotenv';
dotenv.config(); // MUST be at the top

import express from 'express';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

const app = express(); 
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', async (req, res) => {
    res.send('Hello from AI Image Generator Server')
})

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes); 

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log('Server has started on http://localhost:8080'))
    } 
    catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}

startServer();
