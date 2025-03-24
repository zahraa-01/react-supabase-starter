import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [toDos, setToDos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newToDo, setNewTodo] = useState("");

  console.log("TODOS ARE HEREEEEEE", toDos)

  const postToDo = async () => {
    if (!newToDo.trim()) return; // Prevent empty todos

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo: newToDo }) // Backend expects "newToDo"
      });

      const data = await response.json();
      console.log('To-Do added:', data);

      if (data.success) {
        setNewTodo(""); // Clear input field
        fetchMessages(); // Fetch updated To-Do list after adding a new one
      }
    } catch (err) {
      console.error("Error adding To-Do:", err);
    }
  };

  const handleAddTodo = () => {
    postToDo();
  }

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');

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

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
      <div>
        <h1>My To-Do List</h1>
        <div>
          <input
              type="text"
              placeholder="What do you need to do?"
              value={newToDo}
              onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={handleAddTodo}>Add a To-Do</button>
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