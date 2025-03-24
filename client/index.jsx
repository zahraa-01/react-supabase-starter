import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { useToDo } from "./helper-functions/useToDo";
import "./styles.css";

function App() {
  const { toDos, loading, error, postToDo, updateToDo } = useToDo();
  const [newToDo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [updatedText, setUpdatedText] = useState("");

  const handleAddTodo = () => {
    if (newToDo.trim()) {
      postToDo(newToDo);
      setNewTodo("");
    }
  };

  const handleUpdateTodo = (id) => {
    if (updatedText.trim()) {
      updateToDo(id, updatedText);
      setEditingId(null); // Exit editing mode
      setUpdatedText(""); // Clear input
    }
  };

    return (
        <div className="app-container">
            <h1 className="title">My To-Do List</h1>
            <div className="input-container">
                <input
                    type="text"
                    className="todo-input"
                    placeholder="Add a new task..."
                    value={newToDo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button className="add-button" onClick={handleAddTodo}>
                    Add
                </button>
            </div>

            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">Error: {error}</p>}

            {!loading && !error && (
                <div className="todo-list">
                    {toDos.length === 0 ? (
                        <p className="empty-text">No tasks yet. Add one above!</p>
                    ) : (
                        toDos.map((todo) => (
                            <div key={todo.id} className="todo-card">
                                {editingId === todo.id ? (
                                    <div className="edit-mode">
                                        <input
                                            type="text"
                                            className="edit-input"
                                            value={updatedText || ""}
                                            onChange={(e) => setUpdatedText(e.target.value)}
                                        />
                                        <div className="button-group">
                                            <button className="save-button" onClick={() => handleUpdateTodo(todo.id)}>
                                                Save
                                            </button>
                                            <button className="cancel-button" onClick={() => setEditingId(null)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="todo-content">
                                        <span className="todo-text">{todo.todo}</span>
                                        <button className="edit-button" onClick={() => { setEditingId(todo.id); setUpdatedText(todo.todo); }}>
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
