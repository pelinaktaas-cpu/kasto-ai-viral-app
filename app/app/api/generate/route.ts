import Replicate from 'replicate';
import { NextResponse } from 'next/server';

// Replicate client'ı başlatıyoruz. Anahtarımız Vercel'den otomatik alınır.
const replicate = new Replicate({});

// 4 adet viral prompt'u belirliyoruz
const styles = [
    "A photo of the person as a powerful CEO, luxury office background, sharp focus, cinematic lighting.",
    "A photo of the person as a high-fashion runway model, dynamic pose, aesthetic gallery background.",
    "A photo of the person as a detailed fantasy hero in warrior armor, intense lighting, epic background.",
    "A photo of the person as an Urban Streetwear Icon, stylish branded clothing, city night background, cinematic bokeh."
];

export async function POST(request: Request) {
    // Client'tan Base64 formatındaki fotoğrafı alıyoruz
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
        return NextResponse.json({ error: 'Image data is missing' }, { status: 400 });
    }

    try {
        // Tüm 4 stili paralel olarak üretmek için promise'ları oluşturuyoruz
        const generationPromises = styles.map((prompt) =>
            replicate.run(
                // Not: Güvenilir ve hızlı bir SDXL modeli kullanıyoruz. InstantID gibi modeller için bu kısım değişebilir.
                "stability-ai/sdxl:39ed52f2a78a93bf4d825308d6c26f002cc305b38d2ceb161e2a86361a41e658", 
                {
                    input: {
                        prompt: prompt,
                        image: imageBase64, // Base64 fotoğrafı gönderiyoruz
                        num_outputs: 1,
                    },
                }
            )
        );

        // 4 işlemin bitmesini bekliyoruz
        const results = await Promise.all(generationPromises);
        
        // Gelen URL'leri tek bir listede topluyoruz
        const outputUrls = results.flat().map(url => url as string);

        return NextResponse.json({ urls: outputUrls }, { status: 200 });

    } catch (error) {
        console.error("Replicate API Error:", error);
        return NextResponse.json({ error: 'Failed to generate images via AI.' }, { status: 500 });
    }
}
