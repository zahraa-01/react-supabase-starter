import { useState, useEffect } from "react";

export function useToDo() {
    const [toDos, setToDos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/todos");

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setToDos(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setToDos([]);
        } finally {
            setLoading(false);
        }
    };

    const postToDo = async (newToDo, priority) => {
        if (!newToDo.trim() || newToDo.length < 3 || newToDo.length > 100) {
            setError('To-Do must be between 3 and 100 characters');
            return;
        }

        if (!priority) {
            setError('Priority must be set for each To-Do');
            return;
        }

        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo: newToDo, priority }),
            });

            const data = await response.json();
            if (data.success) {
                fetchMessages();
            }
        } catch (err) {
            console.error("Error adding To-Do:", err);
        }
    };

    const updateToDo = async (id, updatedToDo) => {
        if (!updatedToDo.trim()) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo: updatedToDo }),
            });

            console.log(response.status);

            const data = await response.json();
            if (data.success) {
                fetchMessages();
            }
        } catch (err) {
            console.error("Error updating To-Do:", err);
        }
    };

    const deleteToDo = async (id) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            console.log(response.status);

            const data = await response.json();
            if (data.success) {
                fetchMessages();
            }
        } catch (err) {
            console.error("Error deleting To-Do:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return { toDos, loading, error, postToDo, updateToDo, deleteToDo };
}