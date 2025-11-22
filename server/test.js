import dotenv from "dotenv";
dotenv.config();
import { InferenceClient } from "@huggingface/inference";
import fs from "fs";

const client = new InferenceClient(process.env.HF_TOKEN);

async function generateImage(prompt) {
  try {
    console.log("Sending prompt:", prompt);

    const imageBlob = await client.textToImage({
      provider: "nscale",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: { num_inference_steps: 5 }, // optional, tweak as needed
    });

    // Convert Blob to Buffer and save as PNG
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync("output.png", buffer);
    console.log("Image saved as output.png");
  } catch (err) {
    console.error("Error generating image:", err);
  }
}

// Example usage:
generateImage("Astronaut riding a horse, detailed, cinematic lighting");
