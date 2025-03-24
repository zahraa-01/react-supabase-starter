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

    const postToDo = async (newToDo) => {
        if (!newToDo.trim()) return;

        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo: newToDo }),
            });

            const data = await response.json();
            if (data.success) {
                fetchMessages();
            }
        } catch (err) {
            console.error("Error adding To-Do:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return { toDos, loading, error, postToDo };
}