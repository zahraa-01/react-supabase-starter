import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { useToDo } from "./helper-functions/useToDo";

function App() {
  const { toDos, loading, error, postToDo } = useToDo();
  const [newToDo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newToDo.trim()) {
      postToDo(newToDo);
      setNewTodo("");
    }
  };

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

        {loading && <p>Loading to-dos...</p>}
        {error && <p>Error: {error}</p>}

        {!loading && !error && (
            <div>
              <h2>What do you need to do?</h2>
              {toDos.length === 0 ? (
                  <p>No to-dos found</p>
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);