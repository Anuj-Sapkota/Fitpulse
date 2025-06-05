import React, { useState } from 'react';
import axios from 'axios';

const PasswordReset = () => {
    const [email, setEmail] = useState("");

    const handleResetRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/password/reset/', { email });
            console.log(response.data);  // "Reset email sent"
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={handleResetRequest}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default PasswordReset;