import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({});

const styles = [
    "A photo of the person as a powerful CEO, luxury office background, sharp focus, cinematic lighting.",
    "A photo of the person as a high-fashion runway model, dynamic pose, aesthetic gallery background.",
    "A photo of the person as a detailed fantasy hero in warrior armor, intense lighting, epic background.",
    "A photo of the person as an Urban Streetwear Icon, stylish branded clothing, city night background, cinematic bokeh."
];

export async function POST(request: Request) {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
        return NextResponse.json({ error: 'Image data is missing' }, { status: 400 });
    }

    try {
        const generationPromises = styles.map((prompt) =>
            replicate.run(
                "stability-ai/sdxl:39ed52f2a78a93bf4d825308d6c26f002cc305b38d2ceb161e2a86361a41e658", 
                {
                    input: {
                        prompt: prompt,
                        image: imageBase64,
                        num_outputs: 1,
                    },
                }
            )
        );

        const results = await Promise.all(generationPromises);
        
        const outputUrls = (results as unknown[]).flat().filter((url): url is string => typeof url === 'string');

        return NextResponse.json({ urls: outputUrls }, { status: 200 });

    } catch (error) {
        console.error("Replicate API Error:", error);
        return NextResponse.json({ error: 'Failed to generate images via AI.' }, { status: 500 });
    }
}
