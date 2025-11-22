import express from 'express';
import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config();

const router = express.Router();
const client = new InferenceClient(process.env.HF_TOKEN);

// 1st Route: Test if the route is working
router.get('/', (req, res) => {
    res.send('Hello from DALL-E route');
});

// 2nd Route: Generate an image using Hugging Face API
router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required' });
        }

        console.log('Received prompt:', prompt);

        // Call Hugging Face API with the new model
        const imageBlob = await client.textToImage({
            provider: 'nscale', // provider for free usage
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
            inputs: prompt,
            parameters: { num_inference_steps: 5 }, // optional tuning
        });

        // Convert Blob to base64
        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageBase64 = buffer.toString('base64');

        res.status(200).json({ photo: imageBase64 });

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ 
            success: false, 
            message: error?.message || 'Something went wrong',
            stack: error?.stack 
        });
    }
});

export default router;
