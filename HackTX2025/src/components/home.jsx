import React from 'react';

const Home = ({ user }) => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to HackTX 2025</h1>
            <p>Hello, {user.name}!</p>

            {user.isAdmin && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Admin Dashboard</h2>
                    <ul>
                        <li>Manage Users</li>
                        <li>View Reports</li>
                        <li>System Settings</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;