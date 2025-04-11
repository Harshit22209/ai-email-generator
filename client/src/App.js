import React, { useState } from 'react';
import './App.css';

function App() {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const handleGenerateEmail = async () => {
    if (!prompt) {
      alert('Please enter a prompt for the email.');
      return;
    }

    setLoading(true);
    setSendStatus('');

    try {
      // Use the API_URL from environment or default to localhost:5000
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/generate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setGeneratedEmail(data.generatedEmail);
      setEditedEmail(data.generatedEmail);
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipients) {
      alert('Please enter at least one recipient.');
      return;
    }

    if (!editedEmail) {
      alert('Please generate an email first.');
      return;
    }

    setLoading(true);
    setSendStatus('');

    try {
      const recipientsList = recipients.split(',').map(email => email.trim());
      
      // Use the API_URL from environment or default to localhost:5000
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: recipientsList,
          emailContent: editedEmail
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Fix: use the response data or remove the unused variable
      const { success, message } = await response.json();
      setSendStatus(message || 'Email sent successfully!');
      
      // Clear form after successful send
      setRecipients('');
      setPrompt('');
      setGeneratedEmail('');
      setEditedEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
      setSendStatus('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Email Generator</h1>
      </header>
      <main>
        <div className="form-group">
          <label htmlFor="recipients">Recipients (comma-separated emails)</label>
          <input
            type="text"
            id="recipients"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="e.g., john@example.com, jane@example.com"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prompt">Email Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want in the email. E.g., 'Write a formal invitation for a company event happening next Friday at 7pm'"
            rows={3}
            disabled={loading}
          />
        </div>

        <button 
          onClick={handleGenerateEmail} 
          disabled={loading || !prompt}
        >
          {loading ? 'Generating...' : 'Generate Email'}
        </button>

        {generatedEmail && (
          <div className="email-section">
            <div className="form-group">
              <label htmlFor="generated-email">Generated Email (Edit as needed)</label>
              <textarea
                id="generated-email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                rows={10}
                disabled={loading}
              />
            </div>

            <button 
              onClick={handleSendEmail} 
              disabled={loading || !recipients || !editedEmail}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
            
            {sendStatus && <p className="status-message">{sendStatus}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;