import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Send, Loader, Eye, X } from 'lucide-react';
import './DocumentUpload.css';

function Text2TaleGenerator() {
  const [generating, setGenerating] = useState(false);
  const [generateStatus, setGenerateStatus] = useState(null);
  const [text, setText] = useState('');
  const [maxLength, setMaxLength] = useState(100);
  const [generatedText, setGeneratedText] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const handleSubmit = async () => {
    if (!text) {
      setGenerateStatus('error');
      return;
    }

    setGenerating(true);
    setGeneratedText('');
    setGenerateStatus(null);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('max_length', maxLength);

    try {
      // const response = await fetch('http://127.0.0.1:8000/generate/', {
        const response = await fetch('http://0.0.0.0:8000/generate/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Generation failed');
      }

      const result = await response.json();
      console.log('Generation result:', result);
      setGeneratedText(result.generated_text);
      setGenerateStatus('success');
    } catch (error) {
      console.error('Error generating:', error);
      setGenerateStatus('error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="document-upload">
      <h2 className="main-title">
        <FileText className="icon" />
        Text2Tale Generator
      </h2>

      <div className="textarea-container">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          rows={8}
          className="text-input"
        />
      </div>

      <div className="input-container">
        <label htmlFor="max-length">Max Length:</label>
        <input
          type="number"
          id="max-length"
          value={maxLength}
          onChange={(e) => setMaxLength(parseInt(e.target.value))}
          min="1"
          className="number-input"
        />
      </div>

      <div className="button-container">
        <button
          onClick={handleSubmit}
          disabled={generating}
          className={`submit-button ${generating ? 'generating' : ''}`}
        >
          {generating ? (
            <>
              <Loader className="icon animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="icon" />
              Generate
            </>
          )}
        </button>

        {generateStatus === 'success' && (
          <button onClick={() => setShowOutput(true)} className="submit-button">
            <Eye className="icon" />
            Show Generated Text
          </button>
        )}
      </div>

      {generateStatus === 'success' && (
        <div className="status-message success">
          <CheckCircle className="icon" />
          Text generated successfully!
        </div>
      )}
      {generateStatus === 'error' && (
        <div className="status-message error">
          <AlertCircle className="icon" />
          Error generating text. Please try again.
        </div>
      )}

      {showOutput && (
        <div className="modal-overlay" onClick={() => setShowOutput(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="dialog-title">Generated Text</h2>
            <div className="user-input-display">
              {generatedText || "No text generated"}
            </div>
            <button onClick={() => setShowOutput(false)} className="close-button">
              <X className="icon" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Text2TaleGenerator;