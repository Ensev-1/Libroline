import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
                params: {
                    q: query || "random",
                    startIndex: (page - 1) * 10,
                    maxResults: 10,
                },
            });
            setData((prevData) => [...prevData, ...response.data.items]);
        } catch (error) {
            console.error("Error fetching data from Google Books API:", error);
        } finally {
            setLoading(false);
        }
    }, [query, page]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleSearch = (e) => {
        e.preventDefault();
        setData([]);
        setPage(1);
        fetchBooks();
    };

    const handleAddFavorite = async (book) => {
        if (!user) {
            alert("You must be logged in to add favorites.");
            return;
        }

        try {
            await axios.post('http://localhost:3001/favorites', {
                userId: user.id,
                book: {
                    id: book.id,
                    title: book.volumeInfo.title,
                    author: book.volumeInfo.authors?.join(', '),
                    description: book.volumeInfo.description,
                    link: book.volumeInfo.previewLink
                },
            });
            alert(`${book.volumeInfo.title} has been added to your favorites!`);
        } catch (error) {
            console.error("Error adding favorite:", error);
            alert("Failed to add favorite. Please try again.");
        }
    };


    const handleReadMore = (book) => {
        navigate(`/bookdetails/${encodeURIComponent(book.id)}`, { state: { book } });
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dashboard">
            <header className="dashboard--header">
                <h1>Welcome, {user ? user.name : "Guest"}!</h1>
                {user ? (
                    <div>
                        <button className="dashboard--favorites"
                            onClick={() => navigate('/favorites')}
                        >
                            Favorite Books
                        </button>
                        <button className="dashboard--logout"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <div className="dashboard--buttons">
                        <button onClick={() => navigate("/login")}>Login</button>
                            <button onClick={() => navigate("/signup")}>Sign Up</button>
                            <button onClick={() => navigate("/")}>Back to Main Page</button>
                    </div>
                )}
            </header>
            <hr />
            <main>
                <div className="dashboard--header-inline">
                    <h2 style={{ color: "#9c825f" }}>Available Books</h2>
                    <form onSubmit={handleSearch} className="dashboard--search-form">
                        <input
                            type="text"
                            placeholder="Search for books..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="dashboard--search"
                        />
                        <button type="submit" className="dashboard--search-button">
                            Search
                        </button>
                    </form>
                </div>
                <div className="dashboard--books">
                    {data.length > 0 ? (
                        data.map((book, index) => (
                            <div key={index} className="dashboard--book-card">
                                <h3>{book.volumeInfo.title}</h3>
                                <p>
                                    <strong>Author:</strong> {book.volumeInfo.authors?.join(", ") || "Unknown"}
                                </p>
                                <p>
                                    <strong>Genre:</strong>
                                    {book.volumeInfo.categories && book.volumeInfo.categories.length > 0
                                        ? book.volumeInfo.categories.slice(0, 3).join(", ")
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Description:</strong>{" "}
                                    {book.volumeInfo.description
                                        ? book.volumeInfo.description.slice(0, 200) + "..."
                                        : "No description available."}
                                </p>
                                <button
                                    onClick={() => handleAddFavorite(book)}
                                    className="dashboard--favorite-button"
                                    disabled={!user}
                                >
                                    Add to Favorites
                                </button>
                                <button
                                    onClick={() => handleReadMore(book)}
                                    className="dashboard--book-link"
                                >
                                    Read More
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="dashboard--no-books">No books available right now.</p>
                    )}
                </div>
                {loading && <p>Loading...</p>}
                {!loading && (
                    <button
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                        className="dashboard--load-more"
                    >
                        Load More
                    </button>
                )}
            </main>
        </div>
    );
}
