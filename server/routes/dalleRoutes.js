import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
// 1st Route to test if the route is working
router.route('/').get((req, res) => {
    res.send('Hello from DALL-E route');
});

// 2nd Route to generate an image using Hugging Face API
router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        // Call Hugging Face API
        const response = await fetch(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API error: ${errorText}`);
        }

        // Get the image as a buffer
        const imageBuffer = await response.arrayBuffer();
        
        // Convert to base64 (matching OpenAI's b64_json format)
        const image = Buffer.from(imageBuffer).toString('base64');

        res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.message || 'Something went wrong');
    }
});

export default router;