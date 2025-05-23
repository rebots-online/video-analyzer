import { useState, useRef } from 'react';

interface EmbedCodeProps {
  videoId?: string;
  theme?: string;
  className?: string;
}

export const EmbedCode = ({ videoId, theme = 'dark-skeuomorphic', className = '' }: EmbedCodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const embedCodeRef = useRef<HTMLTextAreaElement>(null);
  
  // In a real app, you would generate this based on the current deployment URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-app-url.com';
  const embedUrl = videoId 
    ? `${baseUrl}/embed/${videoId}?theme=${theme}`
    : `${baseUrl}/embed?theme=${theme}`;
    
  const embedCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="500" 
  frameborder="0" 
  allowfullscreen
  style="border: none; border-radius: 8px; overflow: hidden;"
></iframe>`;

  const copyToClipboard = () => {
    if (embedCodeRef.current) {
      navigator.clipboard.writeText(embedCodeRef.current.value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className={`embed-code-container ${className}`}>
      <div className="embed-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span>Get Embed Code</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="embed-content">
          <p>Copy and paste this code to embed the video analyzer on your website:</p>
          <div className="code-container">
            <textarea 
              ref={embedCodeRef} 
              value={embedCode} 
              readOnly 
              className="embed-textarea"
            />
            <button 
              onClick={copyToClipboard} 
              className="copy-button"
              aria-label="Copy to clipboard"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="theme-selector">
            <label>
              <span>Theme:</span>
              <select 
                value={theme}
                onChange={(e) => {
                  // In a real implementation, this would update the embed URL
                  console.log('Theme changed to:', e.target.value);
                }}
                className="theme-select"
              >
                <option value="dark-skeuomorphic">Dark Skeuomorphic</option>
                <option value="light-brutalist">Light Brutalist</option>
                <option value="dark-retro">Dark Retro</option>
              </select>
            </label>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .embed-code-container {
          margin: 1.5rem 0;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .embed-toggle {
          padding: 0.75rem 1rem;
          background: var(--card-bg);
          color: var(--text);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        .embed-toggle:hover {
          background: var(--highlight);
        }
        
        .embed-content {
          padding: 1rem;
          background: var(--card-bg);
          border-top: 1px solid var(--border);
        }
        
        .code-container {
          position: relative;
          margin: 1rem 0;
        }
        
        .embed-textarea {
          width: 100%;
          min-height: 100px;
          padding: 0.75rem;
          padding-right: 80px;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text);
          resize: vertical;
        }
        
        .copy-button {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 0.25rem 0.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.2s;
        }
        
        .copy-button:hover {
          background: var(--primary-hover);
        }
        
        .theme-selector {
          margin-top: 1rem;
        }
        
        .theme-selector label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .theme-select {
          padding: 0.25rem 0.5rem;
          background: var(--input-bg);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
