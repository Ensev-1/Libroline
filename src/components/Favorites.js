import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/favorites/${user.id}`)
                .then((response) => setFavorites(response.data))
                .catch((error) => console.error("Error fetching favorites:", error));
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return <p>You must be logged in to view your favorites.</p>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard--header">
                <h1>Welcome, {user.name}!</h1>
                <div>
                    <button className="dashboard--favorites" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                    <button className="dashboard--logout" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </header>
            <hr />
            <main>
                <h2>Your Favorite Books</h2>
                <div className="dashboard--books">
                    {favorites.length > 0 ? (
                        favorites.map((book, index) => (
                            <div key={book.id || index} className="dashboard--book-card">
                                <h3>{book.title}</h3>
                                <p><strong>Author:</strong> {book.author || "Unknown"}</p>
                                <p>
                                    <strong>Description:</strong>{" "}
                                    {book.description || "No description available."}
                                </p>
                                {book.link && (
                                    <p>
                                        <strong>Book:</strong>{" "}
                                        <a
                                            href={book.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: "#86745d", textDecoration: "underline" }}
                                        >
                                            Read Here
                                        </a>
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="dashboard--no-books">You have no favorite books.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
