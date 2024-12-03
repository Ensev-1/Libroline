import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Registration() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.surname) newErrors.surname = "Surname is required.";
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
        }
        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must include at least one uppercase letter.";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must include at least one number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post('http://localhost:3001/register', formData);
            alert(response.data.message || "Registration successful!");
            setTimeout(() => { navigate("/login"); }, 1000);
        } catch (error) {
            console.error('Error registering user:', error);
            alert(error.response?.data?.message || 'Failed to register user.');
        }
    };

    return (
        <div className="centerWrapper">
            <div className="registration">
                <form onSubmit={handleSubmit}>
                    <h2 className="registration--title">Register</h2>
                    <label className="registration--labels registration--labels-1">
                        Name:
                        <br />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}
                    </label>
                    <label className="registration--labels">
                        Surname:
                        <br />
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                        />
                        {errors.surname && <p className="error">{errors.surname}</p>}
                    </label>
                    <label className="registration--labels">
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
                    <label className="registration--labels">
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
                    <div className="registration--opt">
                        <button className="registration--buttons" type="submit">Register</button>
                        <p onClick={() => navigate("/login")}>Already have an account?</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
