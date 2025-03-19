import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [toDos, setToDos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/todos'); // implicitly performing a GET as it has only one parameter
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setToDos(data);
        setError(null);
      } catch (err) {
        setError(err.todo);
        setToDos([]);
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
              <h2>What do you need to do?</h2>
              {toDos.length === 0 ? (
                  <p>No messages found</p>
              ) : (
                  <ul>
                    {toDos.map((todo, index) => (
                        <li key={index}>{todo.todo}</li>
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