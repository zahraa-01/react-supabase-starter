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
                body: JSON.stringify({ todo: newToDo, priority })
            });

            const data = await response.json();
            if (data.success) {
                fetchMessages();
            }
        } catch (err) {
            console.error("Error adding To-Do:", err);
        }
    };

    const updateToDo = async (id, updatedText, updatedPriority) => {
        try {
            console.log(`Updating To-Do with ID: ${id}`);
            console.log(`New Text: ${updatedText}, New Priority: ${updatedPriority}`);

            console.log("Request Body for Update:", { todo: updatedText, priority: updatedPriority });

            const response = await fetch(`/api/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo: updatedText, priority: updatedPriority })
            });

            const data = await response.json();
            console.log('Response from server:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update To-Do');
            }

            fetchMessages();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const deleteToDo = async (id) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

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