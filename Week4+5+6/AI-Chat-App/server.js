const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');
const mongoose = require('mongoose');
const Conversation = require('./models/Conversation');
const UserPreferences = require('./models/UserPreferences');
const app = express();

const WINDOW_SIZE = 8;   // sirf last 8 messages "raw" rakhe jayenge

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// const SYSTEM_PROMPT = 'You are a friendly, helpful, and concise assistant. Respond in plain text only — do not use markdown formatting like **bold**, bullet points with dashes, or headings.';
// ===== DYNAMIC PROMPT TEMPLATE =====
function buildSystemPrompt(prefs) {
  let prompt = 'You are a friendly, helpful assistant.';

  if (prefs?.name) {
    prompt += ` The user's name is ${prefs.name} — address them by name occasionally.`;
  }

  if (prefs?.tone === 'formal') {
    prompt += ' Always respond in a formal, professional tone.';
  } else {
    prompt += ' Keep your tone casual and friendly, like talking to a friend.';
  }

  if (prefs?.language === 'Urdu') {
    prompt += ' Respond primarily in Urdu (written in Roman Urdu), unless the user writes in English.';
  }

  return prompt;
}

const MODEL = [
  'meta-llama/llama-3.3-70b-instruct:free',
  // 'nvidia/nemotron-3-nano-30b-a3b:free',
  // 'openai/gpt-oss-120b:free',
  'openrouter/free',
];  /*'openai/gpt-oss-120b:free';*/    // OR  openai/gpt-oss-120b:free

// ===== TOOL DEFINITIONS (JSON Schema) =====
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const tools = [
  {
    type: 'function',
    function: {
      name: 'calculate',
      description: 'Evaluate a mathematical expression and return the result',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'The math expression to evaluate, e.g. "125 * 48"',
          },
        },
        required: ['expression'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description: 'Get the current weather for a given city',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'The city name, e.g. "Lahore"',
          },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'convertCurrency',
      description: 'Convert an amount from one currency to another',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'The amount to convert' },
          from: { type: 'string', description: 'Source currency code, e.g. "USD"' },
          to: { type: 'string', description: 'Target currency code, e.g. "PKR"' },
        },
        required: ['amount', 'from', 'to'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'searchConversations',
      description: 'Search past saved conversations by keyword in their title',
      parameters: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: 'Keyword to search for in conversation titles' },
        },
        required: ['keyword'],
      },
    },
  },
];

// ===== TOOL EXECUTION =====
async function executeTool(name, args) {
  if (name === 'calculate') {
    try {
      const result = Function(`"use strict"; return (${args.expression})`)();     // Function() constructor for expression evaluate
      return { result };      // e.g 18 (6*3)
    } catch (err) {
      return { error: 'Invalid expression' };
    }
  }

  if (name === 'getWeather') {
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(args.city)}`);
      const geoData = await geoRes.json();

      if (!geoData.results) {
        return { error: `Could not find city: ${args.city}` };
      }

      const { latitude, longitude, name: foundName } = geoData.results[0];
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();

      return {
        city: foundName,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
      };
    } catch (err) {
      return { error: 'Failed to fetch weather' };
    }
  }

  if (name === 'convertCurrency') {
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${args.from.toUpperCase()}`);
      const data = await res.json();

      if (data.result !== 'success') {
        return { error: `Could not fetch rates for ${args.from}` };
      }

      const rate = data.rates[args.to.toUpperCase()];
      if (!rate) {
        return { error: `Could not find rate for ${args.to}` };
      }

      return {
        original: `${args.amount} ${args.from.toUpperCase()}`,
        converted: `${(args.amount * rate).toFixed(2)} ${args.to.toUpperCase()}`,
      };
    } catch (err) {
      return { error: 'Failed to fetch exchange rate' };
    }
  }
  
  if (name === 'searchConversations') {
    try {
      const results = await Conversation.find({
        title: { $regex: escapeRegex(args.keyword), $options: 'i' },
      }).select('title updatedAt').limit(5);
      
      if (results.length === 0) {
        return { message: `No conversations found matching "${args.keyword}"` };
      }
      return { results: results.map(r => ({ title: r.title, date: r.updatedAt })) };
    } catch (err) {
      return { error: 'Database lookup failed' };
    }
  }
  
  return { error: 'Unknown tool' };
}

// ===== CONTEXT WINDOW MANAGEMENT =====
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

function trimHistory(messages, maxTokens = 3000) {
  let total = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
  const trimmed = [...messages];

  while (total > maxTokens && trimmed.length > 1) {
    const removed = trimmed.shift();
    total -= estimateTokens(removed.content);
  }

  return trimmed;
}

// Get current preferences
app.get('/preferences', async (req, res) => {
  try {
    let prefs = await UserPreferences.findOne();
    if (!prefs) prefs = await UserPreferences.create({});
    res.status(200).json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update preferences
app.put('/preferences', async (req, res) => {
  try {
    const { name, tone, language } = req.body;
    let prefs = await UserPreferences.findOne();
    if (!prefs) prefs = new UserPreferences();

    if (name !== undefined) prefs.name = name;
    if (tone !== undefined) prefs.tone = tone;
    if (language !== undefined) prefs.language = language;

    await prefs.save();
    res.status(200).json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== CONVERSATION ROUTES (persistent memory) =====

// Get all saved conversations (sidebar list)
app.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 }).select('title updatedAt');
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one full conversation (when user clicks a sidebar item)
app.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a conversation
app.delete('/conversations/:id', async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Renaming a conversation
app.patch('/conversations/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const updated = await Conversation.findByIdAndUpdate(
      req.params.id,
      { title: title.trim() },
      { new: true }
    );

    if (!updated) return res.status(400).json({ error: 'Not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// fully functional conversation
app.post('/chat-stream', async (req, res) => {
  try {
    const { messages, conversationId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Fetch user preferences and build a dynamic system prompt
    let prefs = await UserPreferences.findOne();
    const systemPrompt = buildSystemPrompt(prefs);

    // existing conversation se purana summary uthao (agar hai)
    let existingSummary = '';
    if (conversationId) {
      const existingConvo = await Conversation.findById(conversationId).select('summary');
      existingSummary = existingConvo?.summary || '';
    }

    const { recentMessages, summary } = await manageContext(messages, existingSummary);

    let finalSystemPrompt = systemPrompt;
    if (summary) {
      finalSystemPrompt += `\n\nSummary of earlier conversation: ${summary}`;
    }

    let fullMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...recentMessages,
    ];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

// NEW — context window usage frontend ko batao, content shuru hone se pehle
    const tokensUsed = recentMessages.reduce((sum, m) => sum + estimateTokens(m.content), 0);
    res.write(`data: ${JSON.stringify({ meta: { tokensUsed, maxTokens: 3000, summarized: !!summary } })}\n\n`);

    const initialResponse = await openai.chat.completions.create({    // Model ko pehli (non-streaming) call
      models: MODEL,           // 'openrouter/free'
      messages: fullMessages,
      tools: tools,            // 4 tools ki JSON schemas bhi saath jati hain
      });

// ===== SLIDING WINDOW + SUMMARIZATION =====

async function summarizeMessages(oldMessages) {
  const transcript = oldMessages.map((m) => `${m.role}: ${m.content}`).join('\n');
  const response = await openai.chat.completions.create({
    models: MODEL,
    messages: [
      { role: 'system', content: 'Summarize this conversation excerpt in 2-3 short sentences. Capture key facts, names, and decisions — nothing else.' },
      { role: 'user', content: transcript },
    ],
  });
  return response.choices[0].message.content || '';
}

async function manageContext(messages, existingSummary) {
  if (messages.length <= WINDOW_SIZE) {
    return { recentMessages: messages, summary: existingSummary };
  }

  // Sliding window: purane messages "window" se bahar
  const older = messages.slice(0, messages.length - WINDOW_SIZE);
  const recentMessages = messages.slice(-WINDOW_SIZE);

  // Summarization: delete nahi kiya, summary bana ke rakh liya
  const newSummary = await summarizeMessages(older);
  const combinedSummary = existingSummary
    ? `${existingSummary} ${newSummary}`
    : newSummary;

  return { recentMessages, summary: combinedSummary };
}
    const responseMessage = initialResponse.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    let assistantReply = '';

    if (toolCalls && toolCalls.length > 0) {
      res.write(`data: ${JSON.stringify({ toolCall: toolCalls[0].function.name })}\n\n`);     // frontend -> App.jsx 🔧 Using calculate..." badge
      
      fullMessages.push(responseMessage);   // here model tool-request message add in history
      for (const call of toolCalls) {       // Tool actually working
        const args = JSON.parse(call.function.arguments);      // { e.g. expression: "6 * 3" }
        const result = await executeTool(call.function.name, args);  // here real execution (ref 97 line function)
        fullMessages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result),    // { result: 18 } back to history
        });
      }

      const finalStream = await openai.chat.completions.create({        // 2nd call streaming one
        models: MODEL,
        messages: fullMessages,    // now with tool result included
        stream: true,
      });

      for await (const chunk of finalStream) {      // Chunks stream to frontend
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          assistantReply += content;    // full reply accumulate
          res.write(`data: ${JSON.stringify({ content })}\n\n`);          // ek chunk foran bheja (now back to App.jsx 121-165)
        }
      }
    } else {
      assistantReply = responseMessage.content || '';
      res.write(`data: ${JSON.stringify({ content: assistantReply })}\n\n`);
    }

    // ===== SAVE TO DATABASE =====
    const userMessage = messages[messages.length - 1];
    let savedConversation;

    if (conversationId) {
      savedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $push: { messages: { $each: [userMessage, { role: 'assistant', content: assistantReply }] } },
          $set: { summary },   // NEW
        },
        { new: true }
      );
    } else {
      savedConversation = await Conversation.create({
        title: userMessage.content.slice(0, 40),
        summary,   // NEW
        messages: [userMessage, { role: 'assistant', content: assistantReply }],
      });
    }

    // conversationId back to frontend (ref 158-160 App.jsx)
    res.write(`data: ${JSON.stringify({ conversationId: savedConversation._id })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
      console.error('Stream Error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Streaming failed', details: err.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
        res.end();
      }
    }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});