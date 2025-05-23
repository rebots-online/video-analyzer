import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import UploadArea from './UploadArea';
import EmbedCode from './EmbedCode';
import { Theme, themes } from './themes';
import { VideoAnalysis } from './types';

function App() {
  // State for theme and UI
  const [theme, setTheme] = useState<Theme>('dark-skeuo');
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  
  // State for video handling
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Apply theme when it changes
  useEffect(() => {
    const root = document.documentElement;
    root.className = themes[theme].className;
  }, [theme]);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysis({
        summary: 'This is a sample analysis of your video. In a real implementation, this would contain the actual analysis from the API.',
        timestamps: [
          { time: 30, text: 'Introduction to the video content' },
          { time: 90, text: 'Main demonstration begins' },
          { time: 150, text: 'Key findings and results' },
        ]
      });
    } catch (err) {
      setError('Failed to analyze video. Please try again.');
      console.error('Error analyzing video:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle timestamp click
  const handleTimestampClick = useCallback((time: number) => {
    // This would control the video player to jump to the specific time
    console.log('Jump to time:', time);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render the main content based on state
  const renderContent = () => {
    if (loading) {
      return <div className="loading">Analyzing video...</div>;
    }
    
    if (error) {
      return <div className="error">{error}</div>;
    }
    
    if (!analysis) {
      return (
        <UploadArea 
          onFileSelect={handleFileSelect} 
          isLoading={loading} 
        />
      );
    }
    
    return (
      <div className="analysis-container">
        <div className="video-container">
          {videoUrl && (
            <video 
              src={videoUrl} 
              controls 
              className="video-player"
            />
          )}
        </div>
        <div className="analysis-results">
          <h2>Analysis Results</h2>
          <p>{analysis.summary}</p>
          
          {analysis.timestamps && analysis.timestamps.length > 0 && (
            <div className="timestamps">
              <h3>Key Moments</h3>
              <ul>
                {analysis.timestamps.map((item, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleTimestampClick(item.time)}
                      type="button"
                    >
                      {formatTime(item.time)} - {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="actions">
            <button 
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              className="embed-toggle"
              type="button"
            >
              {showEmbedCode ? 'Hide' : 'Show'} Embed Code
            </button>
            
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="theme-selector"
            >
              <option value="dark-skeuo">Dark Skeuomorphic</option>
              <option value="light-brutalist">Light Brutalist</option>
              <option value="dark-retro">Dark Retro</option>
            </select>
          </div>
          
          {showEmbedCode && videoUrl && (
            <EmbedCode videoId={encodeURIComponent(videoUrl)} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header>
        <h1>Video Analyzer</h1>
      </header>
      
      <main>
        {renderContent()}
      </main>
      
      <style jsx global>{`
        :root {
          --bg-primary: ${themes[theme].colors.background};
          --text-primary: ${themes[theme].colors.text};
          --primary: ${themes[theme].colors.primary};
          --secondary: ${themes[theme].colors.secondary};
          --accent: ${themes[theme].colors.accent};
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          transition: background 0.3s, color 0.3s;
        }
        
        .app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        h1 {
          color: var(--primary);
          margin: 0;
        }
        
        .analysis-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        @media (min-width: 1024px) {
          .analysis-container {
            grid-template-columns: 2fr 1fr;
          }
        }
        
        .video-container {
          position: relative;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .video-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .analysis-results {
          background: var(--bg-secondary, #1e1e1e);
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .timestamps {
          margin-top: 1.5rem;
        }
        
        .timestamps ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .timestamps li {
          margin-bottom: 0.5rem;
        }
        
        .timestamps button {
          background: none;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s;
        }
        
        .timestamps button:hover {
          background: var(--primary);
          color: white;
        }
        
        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }
        
        .embed-toggle,
        .theme-selector {
          padding: 0.5rem 1rem;
          border: 1px solid var(--primary);
          background: none;
          color: var(--primary);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .embed-toggle:hover,
        .theme-selector:hover {
          background: var(--primary);
          color: white;
        }
        
        .theme-selector {
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 1px solid var(--secondary);
        }
        
        .loading,
        .error {
          text-align: center;
          padding: 2rem;
          border-radius: 8px;
          margin: 2rem 0;
        }
        
        .loading {
          background: rgba(0, 0, 0, 0.1);
        }
        
        .error {
          background: rgba(255, 0, 0, 0.1);
          color: #ff6b6b;
        }
      `}</style>
    </div>
  );
}

export default App;
