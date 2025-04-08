import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import './dashboard.css';

const API_BASE_URL = 'http://localhost:8000'; // Updated API base URL

function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isExpanded, setIsExpanded] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDocuments(data.documents.map(doc => ({
        id: doc.name,
        title: doc.name,
        url: `${API_BASE_URL}${doc.url}`
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleDocumentClick = (documentId) => {
    const doc = documents.find(doc => doc.id === documentId);
    setSelectedDocument(doc ? [{ uri: doc.url }] : null);
    setIsExpanded(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [documentId]: !prevState[documentId]
    }));
  };

  const toggleExpand = (documentId) => {
    setIsExpanded(prevState => ({ ...prevState, [documentId]: !prevState[documentId] }));
    if (!isExpanded[documentId]) {
      const doc = documents.find(d => d.id === documentId);
      setSelectedDocument(doc ? [{ uri: doc.url }] : null);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setUploading(true);
      setUploadError('');
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }

        fetchDocuments(); // Refresh document list
        event.target.value = null;
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError('Failed to upload document: ' + error.message);
      } finally {
        setUploading(false);
      }
    } else if (file) {
      setUploadError('Invalid file type. Only DOCX files are allowed.');
      event.target.value = null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PoliBOT</h1>
      </header>
      <div className="main-content">
        <div className="document-list-container">
          <h2>Available Policies</h2>
          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-button">
              {uploading ? 'Uploading...' : 'Upload Document'}
            </label>
            <input 
              id="file-upload" 
              type="file" 
              accept=".docx" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              disabled={uploading} 
            />
            {uploadError && <p className="error-message">{uploadError}</p>}
          </div>
          <ul>
            {documents.map(doc => (
              <li key={doc.id}>
                <div className="document-item-header" onClick={() => toggleExpand(doc.id)}>
                  {doc.title}
                  <span className="expand-icon">{isExpanded[doc.id] ? '-' : '+'}</span>
                </div>
                {isExpanded[doc.id] && (
                  <div className="document-details">
                    <button onClick={() => handleDocumentClick(doc.id)}>View Content</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="document-viewer-container word-editor-theme">
          <h2>Document Viewer</h2>
          {selectedDocument ? (
            <div className="doc-viewer-wrapper">
              <DocViewer
                documents={selectedDocument}
                pluginRenderers={DocViewerRenderers}
                config={{
                  header: { disableHeader: true },
                }}
              />
            </div>
          ) : (
            <p>Select a document to view its content.</p>
          )}
        </div>
        <div className="chatbot-container">
          <div className="chatbot-icon">
            <img src="chatbot_icon.png" alt="Chatbot" width="50" height="50" style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;