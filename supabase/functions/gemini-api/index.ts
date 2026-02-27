import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const body = await req.json().catch(e => {
            console.error("Error parsing request body:", e);
            return null;
        });

        if (!body) {
            return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const { contents, systemPrompt, model = 'gemini-1.5-flash' } = body;

        if (!GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is not defined in Supabase Secrets (Environment Variables).");
            return new Response(JSON.stringify({
                error: "GEMINI_API_KEY not found in backend secrets.",
                hint: "Please set the GEMINI_API_KEY secret in the Supabase Dashboard -> Settings -> Edge Functions -> Secrets."
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const version = 'v1beta';
        const endpoint = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const payload: any = { contents };
        if (systemPrompt) {
            payload.systemInstruction = {
                role: "system",
                parts: [{ text: systemPrompt }]
            };
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Google API Error:", result);
            return new Response(JSON.stringify({
                error: "Google API returned an error",
                details: result,
                status: response.status
            }), {
                status: response.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(result), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error("Internal Server Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
