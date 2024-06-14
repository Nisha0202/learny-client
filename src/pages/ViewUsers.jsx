import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdmNav from '../components/AdmNav';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
const ViewUsers = () => {
    // const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect(() => {
    //     // Fetch all users when the component mounts
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/api/users');
    //             setUsers(response.data);
    //         } catch (error) {
    //             console.error('Error fetching users:', error);
    //         }
    //     };

    //     fetchUsers();
    // }, []);
    async function fetchUsers() {
        const res = await fetch('http://localhost:5000/api/users');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }

   
    

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


        const { data: users, isError, isLoading } = useQuery({
            queryKey: 'users',
            queryFn: fetchUsers,
        });
    
    if (isLoading)
        return (
          <div className='container min-h-[75vh]'>
            <AdmNav/>
            <div className='font-bold grid place-content-center mt-4'>
            Loading...
            </div>
          </div>
        );
      if (isError)
          return (
            <div className='container min-h-[75vh]'>
              <AdmNav/>
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
                    // Skip the admin
                    if (user.email === 'admin@gmail.com') {
                        return null;
                    }

                    return (
                        <div key={user._id} className='p-4 border-2 mt-2'>
                            <h2>Name: {user.username}</h2>
                            <p>Email: {user.email}</p>
                            <p>Current Role:</p>
                            <select className='mt-2' value={user.role} onChange={event => handleRoleChange(user._id, event.target.value)}>
                                <option value="student">Student</option>
                                <option value="teacher">Tutor</option>
                            </select>
                            <button className='btn ms-4 btn-sm'>Update</button>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default ViewUsers;
