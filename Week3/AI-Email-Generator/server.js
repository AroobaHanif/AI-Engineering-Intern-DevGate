const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// genAI variable => Gemini "gateway".

app.post('/generate-email', async (req, res) => {
    try {
        // Get values from the request body ONCE
        const { tone, recipient, intent } = req.body;

        // Validate required fields
        if (!tone || !recipient || !intent) {
            return res.status(400).json({
                error: 'tone, recipient, and intent are all required'
                // this stops a bad/incomplete request before it ever reaches Gemini
            });
        }

        // SYSTEM PROMPT
        const systemPrompt = `You are a professional email-writing assistant.

Rules you must always follow:
- Write clean, well-structured emails only
- Never add explanations outside the email itself
- Keep the email concise (under 150 words) unless asked otherwise
- Always include a subject line, greeting, body, and sign-off
- Match the requested tone exactly`;

        // USER PROMPT
        const userPrompt = `Write an email with the following details:
Tone: ${tone}
Recipient: ${recipient}
Intent/Purpose: ${intent}

Return ONLY in this JSON format:
{
  "subject": "...",
  "body": "..."
}`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-3.1-flash-lite',
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'object',
                    properties: {
                        subject: {
                            type: 'string'
                        },
                        body: {
                            type: 'string'
                        }
                    },
                    required: ['subject', 'body']
                }
            }
        });

        const result = await model.generateContent(userPrompt);     // Gemini calling (actual call to Google's servers)

        const rawText = result.response.text();

        // Convert Gemini's JSON string into an object
        const parsed = JSON.parse(rawText);

        // Token usage
        const usage = result.response.usageMetadata || {};

        const inputTokens = usage.promptTokenCount || 0;
        const outputTokens = usage.candidatesTokenCount || 0;
        const totalTokens = usage.totalTokenCount || 0;

        // Estimated pricing
        const inputCost = (inputTokens / 1_000_000) * 0.25;
        const outputCost = (outputTokens / 1_000_000) * 1.50;
        const totalCost = inputCost + outputCost;

        // Send response
        res.status(200).json({
            subject: parsed.subject,
            body: parsed.body,
            usage: {
                inputTokens,
                outputTokens,
                totalTokens,
                estimatedCost: `$${totalCost.toFixed(6)}`
            }
        });

    } catch (err) {
        console.error('Gemini error:', err);

        res.status(500).json({
            error: 'Failed to generate email',
            details: err.message
        });
    }
});

const PORT = 5050;

app.listen(PORT, () => {
    console.log(`AI Email Generator running on http://localhost:${PORT}`);
});