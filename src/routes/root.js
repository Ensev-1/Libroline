import React from "react";
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"

export default function Root() {
    const navigate = useNavigate()

    return (
        <div className="mainPage">
            <h1 className="mainPage--title">Libroline</h1>
            <main className="mainPage--main">
                <h2>Welcome to Libroline!</h2>
                <p className="mainPage--description" >Discover a world of books at your fingertips. Libroline is your go-to online library
                    where you can browse, download, and enjoy a vast collection of books across various
                    genres. Create your personalized space to organize and keep track of the books you
                    love. Whether you're a casual reader or a passionate bookworm, Libroline is designed
                    to make your reading experience seamless and enjoyable. Dive in and let your literary
                    journey begin!</p>
                <div className="mainPage--buttons">
                    <div>
                        <button onClick={() => navigate("/login")}>Login</button>
                        <button onClick={() => navigate("/signup")}>SignUp</button>
                    </div>
                    <button
                        style={{ marginLeft: "auto" }}
                        onClick={() => navigate("/dashboard")}>
                        Continue as Guest
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
