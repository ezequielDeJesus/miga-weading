/**
 * Nano Banana AI Utility
 * Powered by Google Gemini Image Generation API.
 * Falls back to Canvas simulation if no API key is configured.
 */

const MODEL_IMAGE = 'gemini-2.0-flash-exp';
const MODEL_TEXT = 'gemini-1.5-flash';

function parseDataUrl(dataUrl) {
    if (!dataUrl || !dataUrl.includes(',')) return { mimeType: 'image/jpeg', data: '' };
    const [header, data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    return { mimeType, data };
}

const isKeyValid = () => {
    // Agora validamos se temos a URL do Supabase, já que o Gemini está no backend
    return !!import.meta.env.VITE_SUPABASE_URL;
};

// Send a request to the Gemini API via Supabase Edge Function
async function callGemini(contents, systemPrompt = '', model = MODEL_IMAGE) {
    const { supabase } = await import('../lib/supabase');

    console.log(`🚀 NanoBanana: Calling ${model} via Supabase Edge Function...`);

    const { data, error } = await supabase.functions.invoke('gemini-api', {
        body: { contents, systemPrompt, model }
    });

    if (error) {
        console.error('❌ Edge Function Error:', error);
        throw new Error(error.message || 'Erro na Edge Function do Supabase');
    }

    if (model === MODEL_IMAGE || model.includes('2.0') && !model.includes('text')) {
        const imagePart = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart) throw new Error('No image returned from backend');
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    } else {
        const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textPart) throw new Error('No text returned from backend');
        return textPart;
    }
}

export const NanoBananaAI = {

    /**
     * AI Try-On: Veste o vestido na noiva usando Gemini
     */
    async simulateTryOn(brideSrc, dressSrc) {
        if (!isKeyValid()) {
            console.warn('⚠️ NanoBanana: API Key inválida ou ausente. Usando Canvas.');
            return this._canvasTryOn(brideSrc, dressSrc);
        }

        console.log('🍌 NanoBanana: Chamando Gemini API para Try-On...');
        try {
            const bride = parseDataUrl(brideSrc);
            const dress = parseDataUrl(dressSrc);

            const parts = [
                {
                    text: `ACT AS A PHOTOREALISTIC IMAGE COMPOSITOR.
                    
                    TASK: Dress the woman from Image 1 with the EXACT dress from Image 2.
                    
                    STRICT FAITHFULNESS RULES:
                    1. ZERO HALLUCINATION: Do not change the woman's face, features, skin tone, hair, pose, or body position. She must remain PIXEL-PERFECT from Image 1.
                    2. ENVIRONMENT PRESERVATION: The background, floor, lighting, and any objects in Image 1 must remain 100% identical.
                    3. DRESS FIDELITY: Transfer the wedding dress from Image 2 onto her body. You MUST preserve the exact lace patterns, neckline, sleeve length, and fabric texture of the dress in Image 2. Do not "invent" a simplified version of the dress.
                    4. ANATOMICAL GARMENT FITTING: The dress must wrap around her body following her pose in Image 1, but without distorting the dress design.
                    5. NO RE-IMAGINING: Ensure the final output looks like a professional high-end fashion composite, not an AI generation. 
                    Add a subtle watermark "Nano Banana AI • High Fidelity" to the bottom left.`
                },
                { inlineData: { mimeType: bride.mimeType, data: bride.data } },
                { inlineData: { mimeType: dress.mimeType, data: dress.data } }
            ];

            const result = await callGemini(parts, MODEL_IMAGE);
            console.log('✅ NanoBanana: Imagem gerada com sucesso!');
            return result;
        } catch (error) {
            console.error('❌ NanoBanana API Error (Try-On):', error.message);
            console.warn('↩️ Usando Canvas como fallback...');
            return this._canvasTryOn(brideSrc, dressSrc);
        }
    },

    /**
     * AI Alquimia: Sugere drinks baseados no perfil (Gemini 1.5 Flash)
     */
    async suggestDrink(profile) {
        if (!isKeyValid()) {
            return {
                name: "Essência de Outono (Fallback)",
                desc: "Refrescante, com notas de hibisco e um toque de alecrim, perfeito para celebrar momentos eternos.",
                image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=800"
            };
        }

        console.log('🍹 NanoBanana: Consultando Gemini (2.5 Flash) para drink personalizado...');
        try {
            const extraPreference = profile.extra ? `A noiva também disse: "${profile.extra}". Integre isso ao conceito do drink.` : '';
            const systemPrompt = `Você é um mixologista especialista em casamentos. Responda APENAS em formato JSON com os campos: "name" (nome criativo), "desc" (descrição poética de 1 frase), "image_prompt" (prompt curto em inglês para busca de imagem Unsplash relacionada).`;
            const userPrompt = `Com base no perfil da noiva:
            - Vibe: ${profile.alcohol ? 'Com Álcool' : 'Sem Álcool (Mocktail)'}
            - Paladar: ${profile.taste}
            ${extraPreference}

            Crie um drink exclusivo.`;

            const responseText = await callGemini([{ role: "user", parts: [{ text: userPrompt }] }], systemPrompt, MODEL_TEXT);
            // Limpa possíveis marcações de markdown do JSON
            const jsonStr = responseText.replace(/```json|```/g, '').trim();
            const data = JSON.parse(jsonStr);

            // Usando o novo endpoint de imagens do Unsplash mais confiável
            const imageUrl = `https://images.unsplash.com/featured/800x600?cocktail,${data.image_prompt.replace(/\s/g, ',')}`;

            return {
                name: data.name,
                desc: data.desc,
                image: imageUrl
            };
        } catch (error) {
            console.error('Alquimia API Error:', error);
            return {
                name: "Brisa da Manhã",
                desc: "Um mix cítrico e leve para celebrar o amor.",
                image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
            };
        }
    },

    /**
     * AI Decoration: Transforma o ambiente com o estilo escolhido
     */
    async simulateDecoration(roomSrc, style, elements = [], customPrompt = '') {
        if (!isKeyValid()) {
            console.warn('⚠️ NanoBanana: API Key inválida ou ausente. Usando simulação Canvas.');
            return this._canvasDecoration(roomSrc, style, elements);
        }

        console.log(`🏰 NanoBanana: Chamando Gemini API para ${style} (Cenário dos Sonhos)...`);
        if (customPrompt) console.log(`📝 Com instruções extras: "${customPrompt}"`);

        try {
            const room = parseDataUrl(roomSrc);
            const elementsList = elements.length > 0 ? elements.join(', ') : 'elegant wedding details';

            const styleDescriptions = {
                'clássico': 'classic, timeless, romantic, dusty rose and ivory tones, soft lighting',
                'luxuoso': 'luxurious, opulent, gold accents, dramatic lighting, chandelier, rich textures',
                'minimalista': 'minimalist, clean lines, white and sage green, natural light, modern'
            };
            const styleDesc = styleDescriptions[style] || 'elegant wedding';

            const parts = [
                {
                    text: `You are an expert wedding interior designer and AI image editor. 
                    Transform this venue/room photo into a stunning ${styleDesc} wedding decoration scene.
                    Add ${elementsList} that blend naturally with the existing space.
                    
                    CRITICAL USER REQUESTS (PRIORITY): 
                    ${customPrompt || 'None provided. Use your expertise for extra details.'}
                    
                    Keep the original room structure and architecture intact.
                    Make the lighting, colors and atmosphere match the style and user requests.
                    The result should look like a real professionally decorated wedding venue.
                    Add a subtle watermark "Nano Banana AI • Cenário: ${style}" at the bottom left.`
                },
                { inlineData: { mimeType: room.mimeType, data: room.data } }
            ];

            const result = await callGemini(parts, MODEL_IMAGE);
            console.log('✅ NanoBanana: Decoração gerada com sucesso via Gemini!');
            return result;
        } catch (error) {
            console.error('❌ NanoBanana API Error (Decoration):', error.message);
            console.warn('↩️ Usando simulação Canvas como fallback...');
            return this._canvasDecoration(roomSrc, style, elements);
        }
    },

    // ─── Canvas Fallback ────────────────────────────────────────────────────

    addBranding(ctx, width, height, text = 'Nano Banana AI • Realistic Try-on') {
        ctx.save();
        ctx.font = "bold 24px 'Plus Jakarta Sans'";
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'white';
        ctx.fillText(text, 30, height - 30);
        ctx.restore();
    },

    _canvasTryOn(brideSrc, dressSrc) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const brideImg = new Image();
            const dressImg = new Image();

            brideImg.onload = () => {
                canvas.width = brideImg.width;
                canvas.height = brideImg.height;
                ctx.drawImage(brideImg, 0, 0);

                dressImg.onload = () => {
                    const dScale = (canvas.height * 0.68) / dressImg.height;
                    const dWidth = dressImg.width * dScale;
                    const dHeight = dressImg.height * dScale;
                    const dx = (canvas.width - dWidth) / 2;
                    const dy = canvas.height * 0.20;

                    ctx.save();
                    ctx.shadowBlur = 60;
                    ctx.shadowColor = 'rgba(181, 101, 118, 0.4)';
                    ctx.globalAlpha = 0.95;
                    ctx.drawImage(dressImg, dx, dy, dWidth, dHeight);
                    ctx.restore();

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    this.addBranding(ctx, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                };
                dressImg.src = dressSrc;
            };
            brideImg.src = brideSrc;
        });
    },

    _canvasDecoration(roomSrc, style, elements = []) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const roomImg = new Image();

            roomImg.onload = () => {
                canvas.width = roomImg.width;
                canvas.height = roomImg.height;

                if (style === 'clássico') {
                    ctx.filter = 'contrast(1.1) brightness(1.05)';
                } else if (style === 'luxuoso') {
                    ctx.filter = 'saturate(1.2) brightness(1.15) contrast(1.05)';
                } else if (style === 'minimalista') {
                    ctx.filter = 'grayscale(30%) brightness(1.05) contrast(0.9)';
                }

                ctx.drawImage(roomImg, 0, 0);
                ctx.filter = 'none';

                if (style === 'clássico') {
                    ctx.fillStyle = 'rgba(181, 130, 126, 0.12)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else if (style === 'luxuoso') {
                    ctx.fillStyle = 'rgba(255, 215, 0, 0.08)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                this.addBranding(ctx, canvas.width, canvas.height, `Nano Banana AI • Scene: ${style}`);
                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            roomImg.src = roomSrc;
        });
    },

    /**
     * AI Trends: Gera tendências e dicas semanais (Gemini 2.5 Flash)
     */
    async getWeeklyTrends() {
        if (!isKeyValid()) {
            return [
                { categoria: 'Tendências', titulo: 'The Palette', descricao: 'Tons terrosos misturados com pêssego suave estão com tudo, querida.', imagem_keyword: 'wedding decoration peach and terracotta' },
                { categoria: 'Comidas em Alta', titulo: 'Mini Grazing Tables', descricao: 'Miga, pequenas estações de frios e frutas são o hit dos casamentos boutique.', imagem_keyword: 'wedding grazing table' },
                { categoria: 'Decoração em Alta', titulo: 'Suspended Florals', descricao: 'Flores pendentes trazem um drama sofisticado, maravilhosa.', imagem_keyword: 'hanging wedding flowers' }
            ];
        }

        console.log('📰 NanoBanana: Buscando tendências frescas via Gemini (2.5 Flash)...');
        try {
            const systemPrompt = `Você é a "Miga", a assessora de casamentos mais chique e requisitada do Brasil.
Sua missão nesta requisição é fornecer 3 tendências de casamento atuais e elegantes para a noiva.
O tom deve ser afetuoso ("querida", "maravilhosa"), sofisticado e encorajador.
As descrições devem ser curtas (máximo de 3 frases) e focadas em como a noiva pode aplicar a tendência para ter um efeito 'wow'.

Você DEVE retornar a resposta EXCLUSIVAMENTE no seguinte formato JSON, sem nenhum texto adicional:

{
  "tendencias": [
    {
      "categoria": "NOME DA CATEGORIA (Ex: Tendências, Comidas em Alta, Decoração em Alta)",
      "titulo": "Título da Tendência (Ex: Bridal Statement Accessories)",
      "descricao": "Texto da Miga explicando a dica, com afeto e elegância.",
      "imagem_keyword": "Palavra-chave curta e altamente descritiva EM INGLÊS para buscar uma foto real em bancos de imagem (Ex: 'pearl bridal veil', 'signature wedding cocktail', 'elegant floral wedding arch')"
    }
  ]
}`;

            const userPrompt = "Miga, me conte 3 tendências maravilhosas para o meu casamento hoje?";

            const responseText = await callGemini([{ role: "user", parts: [{ text: userPrompt }] }], systemPrompt, MODEL_TEXT);
            return responseText;
        } catch (error) {
            console.error('Trends API Error:', error);
            return [
                { categoria: 'Tendências', titulo: 'Minimalism', descricao: 'Miga, o minimalismo está de volta com tudo nos vestidos. Menos é mais!', imagem_keyword: 'minimalist wedding dress' }
            ];
        }
    },

    /**
     * Miga Chat: Conversa fluida com a noiva
     */
    async getChatResponse(history, userInput) {
        const systemPrompt = `Você é a "Miga", a assessora de casamentos mais chique do Brasil. 
Sua missão: reduzir a ansiedade da noiva com afeto ("querida", "maravilhosa") e sofisticação. 
Estilo: Frases curtas, ritmo natural, elegância sempre. 
Objetivo: Conversa fluida, validar sentimentos e guiar o sonho.`;

        try {
            const contents = [
                ...history,
                { role: "user", parts: [{ text: userInput }] }
            ];
            return await callGemini(contents, systemPrompt, MODEL_TEXT);
        } catch (error) {
            console.error('Miga Chat Error:', error);
            throw error;
        }
    }
};
