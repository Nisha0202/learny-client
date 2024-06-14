import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdmNav from '../components/AdmNav';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        // Update the user's role in the backend
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}`, { role: newRole });
            // Update the user's role in the state
            setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };


    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter(user => user.username.includes(searchTerm) || user.email.includes(searchTerm));

    return (
        <div className='container min-h-[75vh]'>
            <AdmNav />
            <div>
                <input className='min-w-64 text-sm py-2 border-2' type="text" placeholder="Search by name or email" value={searchTerm} onChange={handleSearchChange} />
                {filteredUsers && filteredUsers.map(user => {
                    // Skip the admin
                    if (user.email === 'admin@gmail.com') {
                        return null;
                    }

                    return (
                        <div key={user._id}>
                            <h2>{user.username}</h2>
                            <p>{user.email}</p>
                            <select value={user.role} onChange={event => handleRoleChange(user._id, event.target.value)}>
                                <option value="student">Student</option>
                                <option value="teacher">Tutor</option>
                              
                            </select>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default ViewUsers;
