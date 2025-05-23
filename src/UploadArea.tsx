import { useCallback, useState, useRef, ChangeEvent, DragEvent, ReactNode } from 'react';
import { FiUpload, FiLoader } from 'react-icons/fi';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  className?: string;
  children?: ReactNode;
}

export default function UploadArea({ 
  onFileSelect, 
  isLoading, 
  className = '',
  children 
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div 
      className={`upload-area ${isDragging ? 'dragging' : ''} ${isLoading ? 'loading' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="video/*"
        style={{ display: 'none' }}
      />
      <div className="upload-content">
        <div className="upload-icon">
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
          )}
        </div>
        <h2>Drop your video here or click to browse</h2>
        <p className="subtext">Supported formats: MP4, WebM, OGG</p>
      </div>
      <style jsx>{`
        .upload-area {
          border: 2px dashed var(--border);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--card-bg);
          box-shadow: var(--card-shadow);
          margin: 1rem 0;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        
        .upload-area:hover, .upload-area.dragging {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        
        .upload-area.loading {
          cursor: wait;
        }
        
        .upload-content {
          z-index: 2;
        }
        
        .upload-icon {
          margin-bottom: 1rem;
          color: var(--primary);
        }
        
        h2 {
          margin: 0.5rem 0;
          color: var(--text);
        }
        
        .subtext {
          color: var(--track);
          margin: 0;
          font-size: 0.9rem;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
