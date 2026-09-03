import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateEmail, resetEmail } from './features/emailSlice';
import './App.css';

function App() {
  const [tone, setTone] = useState('formal');
  const [recipient, setRecipient] = useState('');
  const [intent, setIntent] = useState('');
  const [activeTab, setActiveTab] = useState('compose');

  const dispatch = useDispatch();
  const { result: email, status, error } = useSelector((state) => state.email);
  const loading = status === 'loading';

  const handleGenerate = (e) => {
    e.preventDefault();

    dispatch(resetEmail());
    dispatch(generateEmail({ tone, recipient, intent }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Only Compose is functional for now.
    // Other tabs are visual navigation for the demo.
    if (tab !== 'compose') {
      setTimeout(() => setActiveTab('compose'), 350);
    }
  };

  return (
    <div className="app-shell">

      {/* Ambient background */}
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>
      <div className="grid-background"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <span>✦</span>
          </div>

          <div className="brand-text">
            <span className="brand-name">MailMind</span>
            <span className="brand-subtitle">AI EMAIL STUDIO</span>
          </div>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'compose' ? 'active' : ''}`}
            onClick={() => handleTabClick('compose')}
          >
            <span className="nav-icon">✎</span>
            Compose
          </button>

          <button
            className={`nav-tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => handleTabClick('templates')}
          >
            <span className="nav-icon">▦</span>
            Templates
          </button>

          <button
            className={`nav-tab ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => handleTabClick('insights')}
          >
            <span className="nav-icon">◒</span>
            Insights
          </button>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          <span>Gemini online</span>
        </div>
      </nav>

      {/* MAIN */}
      <main className="main-content">

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-badge">
            <span>✦</span>
            AI-POWERED WRITING
          </div>

          <h1>
            Turn your thoughts into
            <span> polished emails.</span>
          </h1>

          <p>
            Give us the tone, recipient and intent.
            MailMind handles the rest.
          </p>
        </section>

        {/* WORKSPACE */}
        <section className="workspace">

          {/* LEFT — COMPOSER */}
          <div className="panel composer-panel">

            <div className="panel-header">
              <div>
                <span className="panel-kicker">01 / COMPOSE</span>
                <h2>Create your email</h2>
              </div>

              <div className="panel-number">01</div>
            </div>

            <form onSubmit={handleGenerate}>

              {/* Tone */}
              <div className="field-group">
                <label htmlFor="tone">
                  <span className="field-number">01</span>
                  Tone
                </label>

                <div className="select-wrapper">
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="formal">Formal</option>
                    <option value="friendly">Friendly</option>
                    <option value="assertive">Assertive</option>
                    <option value="apologetic">Apologetic</option>
                  </select>

                  <span className="select-arrow">⌄</span>
                </div>
              </div>

              {/* Recipient */}
              <div className="field-group">
                <label htmlFor="recipient">
                  <span className="field-number">02</span>
                  Recipient
                </label>

                <input
                  id="recipient"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. my manager"
                  required
                />
              </div>

              {/* Intent */}
              <div className="field-group">
                <label htmlFor="intent">
                  <span className="field-number">03</span>
                  Intent / Purpose
                </label>

                <textarea
                  id="intent"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  placeholder="e.g. requesting two days leave next week"
                  required
                  rows={5}
                />
              </div>

              {/* Generate */}
              <button
                className={`generate-button ${loading ? 'loading' : ''}`}
                type="submit"
                disabled={loading}
              >
                <span className="button-glow"></span>

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating with Gemini...
                  </>
                ) : (
                  <>
                    <span className="sparkle">✦</span>
                    Generate Email
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

            </form>

            {/* Small tech footer */}
            <div className="composer-footer">
              <span>GEMINI API</span>
              <span className="footer-line"></span>
              <span>STRUCTURED OUTPUT</span>
              <span className="footer-line"></span>
              <span>JSON</span>
            </div>
          </div>

          {/* RIGHT — RESULT */}
          <div className={`panel result-panel ${email ? 'has-result' : ''}`}>

            <div className="panel-header">
              <div>
                <span className="panel-kicker">02 / OUTPUT</span>
                <h2>Email preview</h2>
              </div>

              <div className="live-pill">
                <span></span>
                LIVE
              </div>
            </div>

            {!email && !error && !loading && (
              <div className="empty-state">
                <div className="empty-orbit">
                  <div className="empty-icon">✦</div>
                </div>

                <h3>Your email will appear here</h3>

                <p>
                  Fill in the details on the left and let
                  Gemini turn your idea into a polished message.
                </p>

                <div className="empty-hint">
                  <span>TIP</span>
                  Be specific about what you want to communicate.
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="loading-orb">
                  <div className="orb-core"></div>
                </div>

                <h3>Crafting your email...</h3>

                <p>
                  Gemini is turning your intent into words.
                </p>

                <div className="loading-bar">
                  <span></span>
                </div>
              </div>
            )}

            {error && (
              <div className="error-state">
                <div className="error-icon">!</div>

                <h3>Something went wrong</h3>

                <p>{error}</p>

                <button
                  onClick={() => dispatch(resetEmail())}
                  className="retry-button"
                >
                  Try again
                </button>
              </div>
            )}

            {email && !loading && (
              <div className="email-result">

                <div className="email-meta">
                  <span className="email-label">SUBJECT</span>
                  <div className="subject-line">
                    {email.subject}
                  </div>
                </div>

                <div className="email-divider">
                  <span></span>
                  <span>MESSAGE</span>
                  <span></span>
                </div>

                <div className="email-body">
                  {email.body}
                </div>

                {email.usage && (
                  <div className="usage-grid">

                    <div className="usage-card">
                      <span className="usage-icon">↗</span>
                      <div>
                        <span className="usage-label">INPUT</span>
                        <strong>{email.usage.inputTokens}</strong>
                        <small>tokens</small>
                      </div>
                    </div>

                    <div className="usage-card">
                      <span className="usage-icon">↙</span>
                      <div>
                        <span className="usage-label">OUTPUT</span>
                        <strong>{email.usage.outputTokens}</strong>
                        <small>tokens</small>
                      </div>
                    </div>

                    <div className="usage-card">
                      <span className="usage-icon">Σ</span>
                      <div>
                        <span className="usage-label">TOTAL</span>
                        <strong>{email.usage.totalTokens}</strong>
                        <small>tokens</small>
                      </div>
                    </div>

                    <div className="usage-card cost-card">
                      <span className="usage-icon">$</span>
                      <div>
                        <span className="usage-label">EST. COST</span>
                        <strong>{email.usage.estimatedCost}</strong>
                        <small>per request</small>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>
        </section>

        {/* BOTTOM STATS */}
        <section className="feature-strip">

          <div className="feature">
            <div className="feature-icon">◈</div>
            <div>
              <strong>Structured prompts</strong>
              <span>System + user instructions</span>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">{} </div>
            <div>
              <strong>JSON output</strong>
              <span>Predictable response structure</span>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">⌁</div>
            <div>
              <strong>Real-time usage</strong>
              <span>Actual Gemini token metadata</span>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">◉</div>
            <div>
              <strong>Secure architecture</strong>
              <span>API key stays server-side</span>
            </div>
          </div>

        </section>

        <footer className="footer">
          <span>MAILMIND / AI EMAIL STUDIO</span>
          <span>BUILT WITH REACT + REDUX + GEMINI</span>
        </footer>

      </main>
    </div>
  );
}

export default App;