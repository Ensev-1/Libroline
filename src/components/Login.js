import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post(
                'http://localhost:3001/login',
                { ...formData },
                { withCredentials: true }
            );
            if (response.data.success) {
                login(response.data.user);
                alert("Login successful!");
                navigate("/dashboard");
            } else {
                alert("Invalid credentials.");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login failed.");
            setFormData(prevFormData => ({
                ...prevFormData,
                password: ''
            }))
        }
    };

    return (
        <div className="centerWrapper">
            <div className="login">
                <h2 className="login--title">Login</h2>
                <form onSubmit={handleLogin}>
                    <label className="login--labels login--labels-1">
                        Email:
                        <br />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </label>
                    <label className="login--labels">
                        Password:
                        <br />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </label>
                    <br />
                    <button className="login--buttons" type="submit">Login</button>
                    <button className="login--buttons" onClick={() => navigate("/")}>Back to Main Page</button>
                </form>
            </div>
        </div>
    );
}
