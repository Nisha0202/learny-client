import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdmNav from '../components/AdmNav';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


const ViewUsers = () => {
    const [selectedRoles, setSelectedRoles] = useState({});

    const [searchTerm, setSearchTerm] = useState('');

    const { data: users, isError, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    async function fetchUsers() {
        const res = await fetch('http://localhost:5000/api/users');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }

    const queryClient = useQueryClient();


    const handleRoleChange = (userId, event) => {
        setSelectedRoles({
            ...selectedRoles,
            [userId]: event.target.value,
        });
    };


    const handleUpdateClick = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}`, { role: selectedRoles[userId] });
            queryClient.invalidateQueries('users');
            Swal.fire('Success!', 'Update successful!', 'success'); // Add this line
        } catch (error) {
            console.error(error);
            Swal.fire('failor!', error, 'failor');
        }
    };

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

    if (isLoading)
        return (
            <div className='container min-h-[75vh]'>
                <AdmNav />
                <div className='font-bold grid place-content-center mt-4'>
                    Loading...
                </div>
            </div>
        );
    if (isError)
        return (
            <div className='container min-h-[75vh]'>
                <AdmNav />
                <div className='font-bold grid place-content-center mt-4'>
                    An error has occurred
                </div>
            </div>
        );
    const filteredUsers = users.filter(user => user.username.includes(searchTerm) || user.email.includes(searchTerm));

    return (
        <div className='container min-h-[75vh]'>
            <AdmNav />
            <div>
                <div className='font-bold grid place-content-center mt-4 text-lg'>All Users</div>
                <input className='min-w-64 my-4 rounded-md px-1 text-sm py-2 border-2' type="text" placeholder="Search by name or email" value={searchTerm} onChange={handleSearchChange} />
                {filteredUsers && filteredUsers.map(user => {

                    if (user.email === 'admin@gmail.com') {
                        return null;
                    }

                    return (
                        <div key={user._id} className='p-4 border-2 mt-2'>
                            <h2>Name: {user.username}</h2>
                            <p>Email: {user.email}</p>
                            <p>Current Role:</p>
                            <select className='mt-2' value={selectedRoles[user._id] || user.role}
                                onChange={event => handleRoleChange(user._id, event)}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Tutor</option>
                            </select>

                            <button className='btn ms-4 btn-sm' onClick={() => handleUpdateClick(user._id)}>Update</button>

                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default ViewUsers;
