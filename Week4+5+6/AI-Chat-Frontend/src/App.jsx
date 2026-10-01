import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const bottomRef = useRef(null);
  const [contextInfo, setContextInfo] = useState({ tokenUsed: 0, maxTokens: 3000, trimmedCount: 0 });
  const [prefs, setPrefs] = useState({ name: '', tone: 'casual', language: 'English' });
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load sidebar list on first mount
  useEffect(() => {
    fetchConversations();
    fetchPreferences();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('http://localhost:5001/conversations');
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch('http://localhost:5001/preferences');
      const data = await res.json();
      setPrefs({ name: data.name || '', tone: data.tone || 'casual', language: data.language || 'Englisch' });
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  const savePreferences = async () => {
    setPrefsSaving(true);
    try {
      await fetch('http://localhost:5001/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      setShowPrefs(false);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setPrefsSaving(false);
    }
  };

  const handleSelectConversation = async (id) => {
    if (loading) return;
    try {
      const res = await fetch(`http://localhost:5001/conversations/${id}`);
      const data = await res.json();
      setMessages(data.messages);   // poora purana chat load
      setConversationId(data._id);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  }; // Backend: server.js (ref 200), GET /conversations/:id

  const handleDeleteConversation = (e, id) => {
    e.stopPropagation();
    setDeleteTarget(id);
  };
  
  const confirmDelete = async () => {
    const id = deleteTarget;
    try {
      await fetch(`http://localhost:5001/conversations/${id}`, { method: 'DELETE' });
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (id === conversationId) {
        setMessages([]);
        setConversationId(null);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    } finally {
      setDeleteTarget(null);
    }
  };
  
  const cancelDelete = () => setDeleteTarget(null);

  const startRename = (e, conv) => {
    e.stopPropagation();
    setRenamingId(conv._id);
    setRenameValue(conv.title);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const confirmRename = async (id) => {
    if (!renameValue.trim()) {
      cancelRename();
      return;
    }
    try {
      await fetch(`http://localhost:5001/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: renameValue.trim() }),
      }); // Backend: server.js (ref 221) PATCH /conversations/:id
      setConversations((prev) =>
      prev.map((c) => (c._id === id ? { ...c, title: renameValue.trim() } : c))
    );
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    } finally {
      setRenamingId(null);
      setRenameValue('');
    }
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;   // khaali ya duplicate submit block

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage, { role: 'assistant', content: '', tool: null }];
    setMessages(newMessages);   // UI foran update — user ka message dikh jata hai + khaali assistant bubble (typing dots ke liye)
    setInput('');                // input box clear
    setLoading(true);            // button disable, dusra message rokne ke liye

    try {
      const res = await fetch('http://localhost:5001/chat-stream', {    // backend request
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],   // POORI history + naya message
          conversationId,                         // agar existing chat hai to uski ID
  }),
});

      const reader = res.body.getReader();     // chunks received from backend (ref 295) 
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.replace('data: ', '');
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.toolCall) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], tool: parsed.toolCall };
                return updated;
              });
              continue;
            }

            if (parsed.meta) {
              setContextInfo(parsed.meta);
              continue;
            }

            if (parsed.content) {
              fullText += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], role: 'assistant', content: fullText };
                return updated;    // har chunk pe re-render — isi se typing effect banta hai
              });
            }

            // NEW: backend chat khatam hote hi conversationId bhejta hai (ref server.js 322)
            if (parsed.conversationId) {
              setConversationId(parsed.conversationId);    // next message continue in same chat
            }
          } catch {
            // incomplete chunk, skip
          }
        }
      }
      // now save to Database (line 305-320, backend)
      // Stream end — sidebar list refresh (to show new chat or updated title, // GET /conversations
      fetchConversations();
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Something went wrong. Please try again.' };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
  setMessages([]);
  setConversationId(null);
  setInput('');
};

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={handleNewChat}>+ New chat</button>
        <div className="conversation-list">
          {conversations.map((c) => (
            <div
            key={c._id}
            className={`conversation-item ${c._id === conversationId ? 'active' : ''}`}
            onClick={() => handleSelectConversation(c._id)}
            >
              {renamingId === c._id ? (
                <input
                className="rename-input"
                value={renameValue}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename(c._id);
                  if (e.key === 'Escape') cancelRename();
                }}
                onBlur={() => confirmRename(c._id)}
                />
              ) : (
              <span className="conversation-title">{c.title}</span>
              )}
              <div className="conversation-actions">
                <button className="rename-btn" onClick={(e) => startRename(e, c)}>✎</button>
                <button className="delete-btn" onClick={(e) => handleDeleteConversation(e, c._id)}>✕</button>
                </div>
                </div>
              ))}
        </div>
      </aside>

      <div className="chat-shell">
        <header className="chat-header">
          <div className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 100 100" width="26" height="26">
                <defs>
                  <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
                <rect x="22" y="18" width="56" height="52" rx="20" fill="url(#botGrad)" />
                <circle cx="15" cy="30" r="5" fill="url(#botGrad)" />
                <circle cx="85" cy="30" r="5" fill="url(#botGrad)" />
                <rect x="12" y="26" width="6" height="14" rx="3" fill="url(#botGrad)" />
                <rect x="82" y="26" width="6" height="14" rx="3" fill="url(#botGrad)" />
                <path d="M35 40 Q40 46 45 40" stroke="#05070c" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M55 40 Q60 46 65 40" stroke="#05070c" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M38 55 Q50 65 62 55" stroke="#05070c" strokeWidth="4" fill="none" strokeLinecap="round" />
                <polygon points="42,68 50,80 58,68" fill="url(#botGrad)" />
              </svg>
            </span>
          <span className="brand-name">Wisp</span>
          </div>

          <div className="context-indicator">
            Context: {contextInfo.tokensUsed} / {contextInfo.maxTokens} tokens
            {contextInfo.summarized && ' · earlier context summarized'}
          </div>

          <button className='prefs-btn' onClick={() => setShowPrefs(true)}>⚙ Preferences</button>
        </header>

        <main className="chat-body">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h1>What's on your mind?</h1>
              <p>Ask anything — Wisp streams its answer back in real time.</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((m, i) => (
                <div key={i} className={`message-row ${m.role}`}>
                  <div className="message-avatar">{m.role === 'user' ? 'You' : 'W'}</div>
                  <div className="message-bubble">
                    {m.tool && (
                      <div className="tool-indicator">🔧 Using {m.tool}...</div>
                    )}
                    {m.content ? (
                      m.role === 'assistant' ? (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        m.content
                      )
                    ) : (
                      loading && i === messages.length - 1 && !m.tool ? (
                        <span className="typing-dots"><span></span><span></span><span></span></span>
                      ) : ''
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </main>

        <form className="chat-input-bar" onSubmit={handleSend}>
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
              // Shift+Enter → default behavior chalne do, naya line ban jayegi
          }}
          placeholder="Message Wisp..."
          disabled={loading}
          rows={1}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? '…' : '↑'}
        </button>
      </form>
      </div>
            {deleteTarget && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="confirm-modal">
            <h3>Delete this chat?</h3>
            <p>This will be permanently deleted. This action cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showPrefs && (
        <div className="modal-overlay" onClick={() => setShowPrefs(false)}>
          <div className="confirm-modal prefs-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Preferences</h3>
            <p>Wisp personalizes its replies based on these.</p>

            <label className="prefs-label">Your name</label>
            <input
              className="prefs-input"
              value={prefs.name}
              onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
              placeholder="e.g. Arooba"
            />

            <label className="prefs-label">Tone</label>
            <select
              className="prefs-input"
              value={prefs.tone}
              onChange={(e) => setPrefs({ ...prefs, tone: e.target.value })}
            >
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>

            <label className="prefs-label">Language</label>
            <select
              className="prefs-input"
              value={prefs.language}
              onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
            </select>

            <div className="confirm-modal-actions">
              <button className="cancel-btn" onClick={() => setShowPrefs(false)}>Cancel</button>
              <button className="confirm-delete-btn prefs-save-btn" onClick={savePreferences} disabled={prefsSaving}>
                {prefsSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;