import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/messages'); // implicitly performing a GET as it has only one parameter
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setMessages(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
      <div>
        <h1>My To-Do List</h1>
        <div>
          <input
              type="text"
              placeholder="What do you need to do?"
              onChange={(e) => setNewToDo(e.target.value)}
          />
          <button>Add a To-Do</button>
        </div>

        {loading && <p>Loading messages...</p>}

        {error && <p>Error: {error}</p>}

        {!loading && !error && (
            <div>
              <h2>Messages:</h2>
              {messages.length === 0 ? (
                  <p>No messages found</p>
              ) : (
                  <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message.message}</li>
                    ))}
                  </ul>
              )}
            </div>
        )}
      </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);