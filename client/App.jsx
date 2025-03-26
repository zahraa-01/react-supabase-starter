import React, { useState } from "react";
import { useToDo } from "./helperFunctions/useToDo";

export function App() {
    const { toDos, loading, error, postToDo, updateToDo, deleteToDo } = useToDo();
    const [showLandingPage, setShowLandingPage] = useState(true);
    const [newToDo, setNewTodo] = useState("");
    const [priority, setPriority] = useState("low");
    const [editingId, setEditingId] = useState(null);
    const [updatedText, setUpdatedText] = useState("");
    const [updatedPriority, setUpdatedPriority] = useState("low");
    const [filterPriority, setFilterPriority] = useState("all");

    const handleAddTodo = () => {
        if (newToDo.trim()) {
            postToDo(newToDo, priority);
            setNewTodo("");
        }
    };

    const handleUpdateTodo = (id) => {
        if (updatedText.trim()) {
            updateToDo(id, updatedText, updatedPriority);
            setEditingId(null);
            setUpdatedText("");
            setUpdatedPriority("low");
        }
    };

    const handleDeleteTodo = (id) => {
        deleteToDo(id);
    };

    const filteredTodos = toDos.filter(
        (todo) => filterPriority === "all" || todo.priority === filterPriority
    );

    if (showLandingPage) {
        return (
            <div className="splash-screen">
                <h1 className="splash-title">Oi!</h1>
                <p className="splash-subheader">Get productive loser</p>
                <button className="splash-button" onClick={() => setShowLandingPage(false)}>
                    <img src="/assets/right-arrow-outline.png" alt="Start" />
                </button>
            </div>
        );
    }

    return (
        <div className="app-container">
            <h2 className="title">What shit we doing today?</h2>

            {/* Input and Filter Controls outside the main container for todos */}
            <div className="input-container">
                <input
                    type="text"
                    className="todo-input"
                    value={newToDo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new to-do"
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button className="add-button" onClick={handleAddTodo}>
                    Add
                </button>
            </div>

            {/* Filter by Priority */}
            <div className="filter-container">
                <label className="filter-title">Filter by Priority:</label>
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {/* To-Do Main Container now only holds the list */}
            <div className="todo-main-container">
                <div className="todo-list-container">
                    {loading && <p className="loading-text">Loading...</p>}
                    {error && <p className="error-text">{error}</p>}
                    {!loading && filteredTodos.length === 0 && <p className="empty-text">No tasks available</p>}

                    <ul className="todo-list">
                        {filteredTodos.map((todo) => (
                            <li key={todo.id} className="todo-card">
                                {editingId === todo.id ? (
                                    <div className="edit-mode">
                                        <input
                                            type="text"
                                            className="edit-input"
                                            value={updatedText}
                                            onChange={(e) => setUpdatedText(e.target.value)}
                                        />
                                        <select
                                            value={updatedPriority}
                                            onChange={(e) => setUpdatedPriority(e.target.value)}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
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
                                            <button className="edit-button" onClick={() => {
                                                setEditingId(todo.id);
                                                setUpdatedText(todo.todo);
                                                setUpdatedPriority(todo.priority);
                                            }}>
                                                Edit
                                            </button>
                                            <button className="delete-button" onClick={() => handleDeleteTodo(todo.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}