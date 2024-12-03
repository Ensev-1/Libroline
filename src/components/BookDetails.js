import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
            .then((response) => {
                setBook(response.data);
            })
            .catch((error) => {
                console.error("Error fetching book details:", error);
            });
    }, [id]);

    if (!book) {
        return <div className="bookDetails--loading">Loading book details...</div>;
    }

    const bookInfo = book.volumeInfo;

    return (
        <div className="bookDetails--wrapper">
            <div className="bookDetails--content">
                <button className="bookDetails--backBtn" onClick={() => navigate(-1)}>
                    &larr; Back to Dashboard
                </button>
                <h1 className="bookDetails--title">{bookInfo.title}</h1>
                <p className="bookDetails--author">
                    <strong>Author:</strong> {bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown"}
                </p>
                <p className="bookDetails--genre">
                    <strong>Genre:</strong> {bookInfo.categories ? bookInfo.categories.join(", ") : "N/A"}
                </p>
                <div className="bookDetails--description">
                    <strong>Description:</strong>{" "}
                    {bookInfo.description ? (
                        bookInfo.description.length > 300
                            ? `${bookInfo.description.slice(0, 300)}...`
                            : bookInfo.description
                    ) : (
                        "No description available."
                    )}
                </div>
                <a
                    href={bookInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bookDetails--link"
                >
                    Read
                </a>
                {bookInfo.infoLink && (
                    <a
                        href={bookInfo.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bookDetails--info-link"
                    >
                        More Info
                    </a>
                )}
            </div>
        </div>
    );
}
