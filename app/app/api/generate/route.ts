import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({});

const CONCEPT_PROMPTS = [
    // 0: Corporate Power (12 Prompt)
    [
        "Professional headshot of the person as a Fortune 500 CEO, modern glass office background, confident expression, sharp focus, cinematic lighting, bespoke suit. 8k, photorealistic.",
        "High-key portrait of the person in a modern CEO setting, minimalist attire, subtle lighting, clean background, LinkedIn quality. 8k, photorealistic.",
        "Executive portrait, dark suit, moody lighting, leather chair, cigar smoke effect, rich textures. 8k, photorealistic.",
        "Outdoor professional portrait, skyscraper view background, expensive watch detail, high contrast. 8k, photorealistic.",
        "Formal business attire, black and white conversion, deep contrast, editorial look. 8k, photorealistic.",
        "High-angle shot of the person in business attire, modern architectural background, wide depth of field. 8k, photorealistic.",
        "Candid shot, CEO reading a business report, natural office light, glasses. 8k, photorealistic.",
        "Portrait with a successful, confident smile, muted colors, soft focus background. 8k, photorealistic.",
        "Photo in front of a private jet, casual business wear, sunny day, aspirational. 8k, photorealistic.",
        "Shot looking out a window, blurred city lights background, introspective look. 8k, photorealistic.",
        "Business casual attire, bright, clean studio background, approachable look. 8k, photorealistic.",
        "Portrait with strong, directional sidelight, creating dramatic shadows, sharp edges. 8k, photorealistic."
    ],
    // 1: High Fashion (12 Prompt)
    [
        "High-fashion editorial photography of the person on a runway, avant-garde outfit, dynamic pose, softbox lighting, vogue magazine style. 8k, photorealistic.",
        "Avant-garde portrait, black and white film grain, abstract clothing, minimalist studio background, intense gaze. 8k, photorealistic.",
        "Close-up fashion shot, vibrant colors, artistic makeup, unusual headpiece, harsh flash lighting. 8k, photorealistic.",
        "Street style fashion photography, oversized blazer, designer sneakers, cinematic bokeh, dynamic pose. 8k, photorealistic.",
        "Moody portrait, draped silk fabric, dark shadows, single light source, sensual expression. 8k, photorealistic.",
        "Minimalist fashion shot, wearing monochromatic clothing, simple gray background, emphasis on texture. 8k, photorealistic.",
        "Outdoor fashion shoot, urban decay background, luxury accessories, rebellious attitude. 8k, photorealistic.",
        "Glitter and neon makeup, club lighting, party atmosphere, candid movement shot. 8k, photorealistic.",
        "Couture gown, majestic castle interior background, wide shot, high detail. 8k, photorealistic.",
        "Dramatic side profile, long neck, simple jewelry, elegant and timeless. 8k, photorealistic.",
        "Fashion portrait with blurred motion effect, dynamic pose, high energy. 8k, photorealistic.",
        "Wet look hair, leather clothing, deep shadows, glossy skin texture, intense. 8k, photorealistic."
    ],
    // 2: Fantasy & Mythic (12 Prompt)
    [
        "Cinematic shot of the person as a powerful Medieval Knight in detailed silver armor, epic landscape, dramatic rim lighting, oil painting style. 8k, photorealistic.",
        "Detailed fantasy portrait of the person as a Royal Elven Mage, flowing robes, glowing staff, mystic forest background, fantasy concept art. 8k, photorealistic.",
        "Viking warrior, leather armor, fur cloak, snowy mountainous background, axe in hand, detailed beard/braids. 8k, photorealistic.",
        "Ancient Egyptian Pharoah, golden headdress, jeweled collar, temple background, dramatic shadows. 8k, photorealistic.",
        "Greek Mythology God/Goddess, flowing white toga, marble ruins background, sunlit, heroic pose. 8k, photorealistic.",
        "Japanese Samurai, full traditional armor, cherry blossom background, moody lighting, focus on sword details. 8k, photorealistic.",
        "Pirate Captain, weathered leather coat, stormy ocean background, pistol, intimidating gaze. 8k, photorealistic.",
        "Native American tribal chief, detailed traditional regalia, feather headdress, sunset desert background. 8k, photorealistic.",
        "Mysterious hooded figure, dark cloak, deep forest setting, hidden face, magical glowing effect. 8k, photorealistic.",
        "Medieval Queen/King, crown, velvet robes, candlelit hall, Renaissance painting style. 8k, photorealistic.",
        "Barbarian warrior, scarred skin, fur and leather clothing, dark cave background, holding a club. 8k, photorealistic.",
        "Steampunk adventurer, brass goggles, leather gear, mechanical background, sepia tones. 8k, photorealistic."
    ],
    // 3: Sci-Fi Future (12 Prompt)
    [
        "Cyberpunk future version, synthetic skin implants, glowing neon lights, rain slicked pavement, deep contrast. 8k, photorealistic.",
        "NASA Astronaut portrait on Mars, high-tech space suit, futuristic visor reflection, cinematic lighting, ultra-detailed. 8k, photorealistic.",
        "Dystopian city scavenger, ragged clothing, gas mask, smoggy atmosphere, red and blue neon lights. 8k, photorealistic.",
        "Starship Captain uniform, bridge of a spacecraft background, clean lines, bright futuristic lighting. 8k, photorealistic.",
        "Android/Robot humanoid, visible metallic joints, glowing internal circuitry, dark industrial background. 8k, photorealistic.",
        "Futuristic hacker, glowing computer screen reflection on face, dark room, green matrix code in background. 8k, photorealistic.",
        "Space pirate/smuggler, leather jacket, blaster pistol, alien cantina background, moody shadows. 8k, photorealistic.",
        "Bio-engineered soldier, power armor suit, jungle planet setting, mist and fog effect. 8k, photorealistic.",
        "Virtual reality gamer, wearing complex VR headset, digital particles surrounding them, abstract environment. 8k, photorealistic.",
        "Close-up portrait with holographic display reflecting on face, minimal expression, ultra-modern. 8k, photorealistic.",
        "Time traveler, wearing anachronistic clothing, strange glowing portal background, dramatic motion blur. 8k, photorealistic.",
        "Scientist in a lab coat, futuristic laboratory background, holding glowing vial, clean, sterile lighting. 8k, photorealistic."
    ],
    // 4: Art & Animation (12 Prompt)
    [
        "Pixar movie character portrait, 3D render, highly expressive, colorful, animation studio quality, bright lighting. 8k, photorealistic.",
        "Anime protagonist portrait, dynamic pose, sharp features, intricate cell shading, digital art style, vibrant colors. 8k, photorealistic.",
        "Disney cartoon character, classic animated style, big eyes, warm color palette, fairy tale background. 8k, photorealistic.",
        "Dreamworks animated character, detailed hair, dramatic expression, cinematic lighting, action pose. 8k, photorealistic.",
        "South Park style character, simple 2D cutout style, exaggerated features, snowy background. 8k, photorealistic.",
        "Tim Burton style stop-motion puppet, elongated features, spiral eyes, dark and gloomy atmosphere. 8k, photorealistic.",
        "Ghibli Studio style watercolor painting, soft lines, ethereal lighting, natural background. 8k, photorealistic.",
        "Lego minifigure version, plastic texture, simple block shapes, playful background. 8k, photorealistic.",
        "The Simpsons cartoon character, yellow skin, simple line art, bright colors, iconic setting. 8k, photorealistic.",
        "Oil painting portrait, thick brush strokes, rich texture, classical art museum style. 8k, photorealistic.",
        "Watercolor illustration, soft washes of color, loose brushstrokes, abstract background. 8k, photorealistic.",
        "Pop Art portrait, bold outlines, primary colors, Ben-Day dots texture, Andy Warhol style. 8k, photorealistic."
    ],
    // 5: Vintage & Timeless (12 Prompt)
    [
        "Victorian Era Aristocrat, ornate velvet attire, moody lighting, old library background, high contrast, museum quality. 8k, photorealistic.",
        "1990s Supermodel photo shoot, black and white, grainy film effect, intense gaze, simple tank top, timeless aesthetic. 8k, photorealistic.",
        "1950s Hollywood Film Noir detective, fedora hat, trench coat, rainy street background, dramatic shadows. 8k, photorealistic.",
        "1920s Flapper/Gangster, beaded dress/pinstripe suit, jazz club background, smoky atmosphere, sepia tone. 8k, photorealistic.",
        "1980s Aerobics instructor, neon workout gear, huge hair, vibrant colors, retro studio background. 8k, photorealistic.",
        "1970s Disco dancer, bell bottoms, wide collar shirt, sparkling disco ball background, strong flash. 8k, photorealistic.",
        "1940s Pin-Up model, classic makeup, bright lipstick, simple background, stylized pose. 8k, photorealistic.",
        "Wild West cowboy/cowgirl, leather hat, dusty saloon background, strong sunlight, weathered look. 8k, photorealistic.",
        "Greek philosopher, white marble bust statue effect, ancient ruins background, classical art style. 8k, photorealistic.",
        "1960s Mod fashion, bold geometric patterns, simple clothing, psychedelic colors, bright studio. 8k, photorealistic.",
        "Candid snapshot from a 1970s family photo album, slightly blurry, warm filter, casual clothes. 8k, photorealistic.",
        "Silent film actor/actress, heavy black eyeliner, melodramatic expression, high contrast black and white. 8k, photorealistic."
    ]
];

export async function POST(request: Request) {
    const { imageBase64, styleIndex } = await request.json(); 

    if (!imageBase64) {
        return NextResponse.json({ error: 'Image data is missing' }, { status: 400 });
    }
    
    if (styleIndex === undefined || styleIndex < 0 || styleIndex >= CONCEPT_PROMPTS.length) {
        return NextResponse.json({ error: 'Invalid style selection.' }, { status: 400 });
    }
    
    const selectedPrompts = CONCEPT_PROMPTS[styleIndex];

    try {
        const generationPromises = selectedPrompts.map((prompt) =>
            replicate.run(
                "stability-ai/sdxl:39ed52f2a77a93bf4d825308d6c26f002cc305b38d2ceb161e2a86361a41e658", 
                {
                    input: {
                        prompt: prompt + ", maintain exact face identity, consistent facial features, highly detailed face, 8k uhd",
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
        return NextResponse.json({ error: 'AI generation failed due to server error. Please try again with a clearer photo.' }, { status: 500 });
    }
}
