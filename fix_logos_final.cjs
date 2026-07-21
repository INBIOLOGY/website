const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Define replacement blocks for Instagram, LINE, and TikTok cards
const oldInstagramBlock = `            {/* Instagram Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Instagram Gradient Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px' }}>
                  <defs>
                    <radialGradient id="ig-grad" cx="30%" cy="107%" r="130%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect width="100" height="100" rx="22" fill="url(#ig-grad)" />
                  <rect x="15" y="15" width="70" height="70" rx="18" fill="none" stroke="white" strokeWidth="6" />
                  <circle cx="50" cy="50" r="17" fill="none" stroke="white" strokeWidth="6" />
                  <circle cx="70" cy="30" r="5" fill="white" />
                </svg>
              </div>`;

const newInstagramBlock = `            {/* Instagram Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Instagram Gradient Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 32 32" style={{ width: '64px', height: '64px' }}>
                  <defs>
                    <radialGradient id="ig-grad-32" cx="30%" cy="107%" r="130%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect width="32" height="32" rx="7" fill="url(#ig-grad-32)" />
                  <g transform="translate(4, 4)">
                    <rect x="1" y="1" width="22" height="22" rx="6" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="18" cy="6" r="1.5" fill="white" />
                  </g>
                </svg>
              </div>`;

const oldLineBlock = `            {/* Line Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Line Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px' }}>
                  <rect width="100" height="100" rx="22" fill="#06C755" />
                  <svg x="18" y="18" width="64" height="64" viewBox="0 0 24 24">
                    <path fill="#FFFFFF" d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.564.39.084.922.258 1.057.592.12.296.08.759.039 1.057l-.171 1.028c-.052.316-.248 1.237 1.07 1.026 1.318-.211 7.106-4.184 9.697-7.151 1.89-2.146 2.33-3.834 2.33-5.138zm-16.711 3.513h-2.13a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h.442a.442.442 0 0 1 .442.442v3.93h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.442zm2.973 0h-.442a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h.442a.442.442 0 0 1 .442.442v4.364a.442.442 0 0 1-.442.442zm5.749 0h-.442a.442.442 0 0 1-.416-.296l-2.022-3.327v3.181a.442.442 0 0 1-.442.442h-.442a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h.442c.162 0 .31.089.385.232l2.053 3.37V9.056a.442.442 0 0 1 .442-.442h.442a.442.442 0 0 1 .442.442v4.364a.442.442 0 0 1-.442.442zm4.845-2.22h-1.688v-1.288h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.443zm0-2.142h-1.688V9.458h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.443zm.442 3.92a.442.442 0 0 1-.442.442h-2.13a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h2.13a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.442h-1.688v.868h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.442h-1.688v.903h1.688a.442.442 0 0 1 .442.442v.421z" />
                    </svg>
                  </svg>
                </svg>
              </div>`;

const newLineBlock = `            {/* Line Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Line Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 32 32" style={{ width: '64px', height: '64px' }}>
                  <rect width="32" height="32" rx="7" fill="#06C755" />
                  <g transform="translate(4, 4)">
                    <path fill="#FFFFFF" d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.564.39.084.922.258 1.057.592.12.296.08.759.039 1.057l-.171 1.028c-.052.316-.248 1.237 1.07 1.026 1.318-.211 7.106-4.184 9.697-7.151 1.89-2.146 2.33-3.834 2.33-5.138zm-16.711 3.513h-2.13a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h.442a.442.442 0 0 1 .442.442v3.93h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.442zm2.973 0h-.442a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h.442a.442.442 0 0 1 .442.442v4.364a.442.442 0 0 1-.442.442zm5.749 0h-.442a.442.442 0 0 1-.416-.296l-2.022-3.327v3.181a.442.442 0 0 1-.442.442h-.442a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h.442c.162 0 .31.089.385.232l2.053 3.37V9.056a.442.442 0 0 1 .442-.442h.442a.442.442 0 0 1 .442.442v4.364a.442.442 0 0 1-.442.442zm4.845-2.22h-1.688v-1.288h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.443zm0-2.142h-1.688V9.458h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.443zm.442 3.92a.442.442 0 0 1-.442.442h-2.13a.442.442 0 0 1-.442-.442V9.056a.442.442 0 0 1 .442-.442h2.13a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.442h-1.688v.868h1.688a.442.442 0 0 1 .442.442v.421a.442.442 0 0 1-.442.442h-1.688v.903h1.688a.442.442 0 0 1 .442.442v.421z" />
                  </g>
                </svg>
              </div>`;

const oldTikTokBlock = `            {/* TikTok Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* TikTok Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px' }}>
                  <rect width="100" height="100" rx="22" fill="#010101" />
                  <svg x="20" y="20" width="60" height="60" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.22 2.33 2.08 3.84 2.45v3.62c-1.63-.07-3.21-.68-4.51-1.68-.4-.31-.77-.66-1.1-1.05v7.88c.03 2.44-.9 4.8-2.61 6.55-1.71 1.75-4.07 2.74-6.52 2.75-2.45 0-4.81-1-6.52-2.75-1.71-1.75-2.64-4.11-2.61-6.56.03-2.45.98-4.79 2.69-6.51 1.71-1.72 4.07-2.68 6.52-2.65V7.4c-1.31 0-2.58.53-3.5 1.48s-1.42 2.22-1.4 3.53.53 2.58 1.48 3.5 2.22 1.42 3.53 1.4 2.58-.53 3.5-1.48c.95-.94 1.45-2.24 1.4-3.55V.02z" fill="#25F4EE" transform="translate(-0.8, -0.6)" />
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.22 2.33 2.08 3.84 2.45v3.62c-1.63-.07-3.21-.68-4.51-1.68-.4-.31-.77-.66-1.1-1.05v7.88c.03 2.44-.9 4.8-2.61 6.55-1.71 1.75-4.07 2.74-6.52 2.75-2.45 0-4.81-1-6.52-2.75-1.71-1.75-2.64-4.11-2.61-6.56.03-2.45.98-4.79 2.69-6.51 1.71-1.72 4.07-2.68 6.52-2.65V7.4c-1.31 0-2.58.53-3.5 1.48s-1.42 2.22-1.4 3.53.53 2.58 1.48 3.5 2.22 1.42 3.53 1.4 2.58-.53 3.5-1.48c.95-.94 1.45-2.24 1.4-3.55V.02z" fill="#FE2C55" transform="translate(0.8, 0.6)" />
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.22 2.33 2.08 3.84 2.45v3.62c-1.63-.07-3.21-.68-4.51-1.68-.4-.31-.77-.66-1.1-1.05v7.88c.03 2.44-.9 4.8-2.61 6.55-1.71 1.75-4.07 2.74-6.52 2.75-2.45 0-4.81-1-6.52-2.75-1.71-1.75-2.64-4.11-2.61-6.56.03-2.45.98-4.79 2.69-6.51 1.71-1.72 4.07-2.68 6.52-2.65V7.4c-1.31 0-2.58.53-3.5 1.48s-1.42 2.22-1.4 3.53.53 2.58 1.48 3.5 2.22 1.42 3.53 1.4 2.58-.53 3.5-1.48c.95-.94 1.45-2.24 1.4-3.55V.02z" fill="#FFFFFF" />
                  </svg>
                </svg>
              </div>`;

const newTikTokBlock = `            {/* TikTok Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* TikTok Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 32 32" style={{ width: '64px', height: '64px' }}>
                  <rect width="32" height="32" rx="7" fill="#010101" />
                  <g transform="translate(4, 4)">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.22 2.33 2.08 3.84 2.45v3.62c-1.63-.07-3.21-.68-4.51-1.68-.4-.31-.77-.66-1.1-1.05v7.88c.03 2.44-.9 4.8-2.61 6.55-1.71 1.75-4.07 2.74-6.52 2.75-2.45 0-4.81-1-6.52-2.75-1.71-1.75-2.64-4.11-2.61-6.56.03-2.45.98-4.79 2.69-6.51 1.71-1.72 4.07-2.68 6.52-2.65V7.4c-1.31 0-2.58.53-3.5 1.48s-1.42 2.22-1.4 3.53.53 2.58 1.48 3.5 2.22 1.42 3.53 1.4 2.58-.53 3.5-1.48c.95-.94 1.45-2.24 1.4-3.55V.02z" fill="#25F4EE" transform="translate(-0.4, -0.3)" />
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.22 2.33 2.08 3.84 2.45v3.62c-1.63-.07-3.21-.68-4.51-1.68-.4-.31-.77-.66-1.1-1.05v7.88c.03 2.44-.9 4.8-2.61 6.55-1.71 1.75-4.07 2.74-6.52 2.75-2.45 0-4.81-1-6.52-2.75-1.71-1.75-2.64-4.11-2.61-6.56.03-2.45.98-4.79 2.69-6.51 1.71-1.72 4.07-2.68 6.52-2.65V7.4c-1.31 0-2.58.53-3.5 1.48s-1.42 2.22-1.4 3.53.53 2.58 1.48 3.5 2.22 1.42 3.53 1.4 2.58-.53 3.5-1.48c.95-.94 1.45-2.24 1.4-3.55V.02z" fill="#FE2C55" transform="translate(0.4, 0.3)" />
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.22 2.33 2.08 3.84 2.45v3.62c-1.63-.07-3.21-.68-4.51-1.68-.4-.31-.77-.66-1.1-1.05v7.88c.03 2.44-.9 4.8-2.61 6.55-1.71 1.75-4.07 2.74-6.52 2.75-2.45 0-4.81-1-6.52-2.75-1.71-1.75-2.64-4.11-2.61-6.56.03-2.45.98-4.79 2.69-6.51 1.71-1.72 4.07-2.68 6.52-2.65V7.4c-1.31 0-2.58.53-3.5 1.48s-1.42 2.22-1.4 3.53.53 2.58 1.48 3.5 2.22 1.42 3.53 1.4 2.58-.53 3.5-1.48c.95-.94 1.45-2.24 1.4-3.55V.02z" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>`;

code = code.replace(oldInstagramBlock, newInstagramBlock);
code = code.replace(oldLineBlock, newLineBlock);
code = code.replace(oldTikTokBlock, newTikTokBlock);

// 2. Also update Aleen's focal position in REVIEWS to center 33%
code = code.replace(
  /imagePosition:\s*'center\s+35%'/,
  "imagePosition: 'center 33%'"
);

fs.writeFileSync('src/App.jsx', code, 'utf8');
console.log('App.jsx successfully updated with single-viewbox non-clipping SVGs!');
