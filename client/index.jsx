import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { useToDo } from "./helper-functions/useToDo";
import "./styles.css";

function App() {
    const { toDos, loading, error, postToDo, updateToDo, deleteToDo } = useToDo();
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
            setEditingId(null);
            setUpdatedText("");
        }
    };

    const handleDeleteTodo = (id) => {
        deleteToDo(id);
    };

    return (
        <div className="app-container">
            <h1 className="title">To-Do List</h1>

            {/* Input for new To-Do */}
            <div className="input-container">
                <input
                    type="text"
                    className="todo-input"
                    value={newToDo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new to-do"
                />
                <button className="add-button" onClick={handleAddTodo}>
                    Add
                </button>
            </div>

            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && toDos.length === 0 && <p className="empty-text">No tasks available</p>}

            <ul className="todo-list">
                {toDos.map((todo) => (
                    <li key={todo.id} className="todo-card">
                        {editingId === todo.id ? (
                            <div className="edit-mode">
                                <input
                                    type="text"
                                    className="edit-input"
                                    value={updatedText}
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
                            <>
                                <span className="todo-text">{todo.todo}</span>
                                <div className="button-group">
                                    <button className="edit-button" onClick={() => setEditingId(todo.id)}>
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteTodo(todo.id, todo)}>
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
