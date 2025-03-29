import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Move fetchUsers outside of useEffect to avoid redefining it each time
  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);  // Call fetchUsers on page change
  }, [page]);  // No need to include fetchUsers since it's not inside useEffect anymore

  // Handle deletion of a user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));  // Remove user from the list after deletion
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Users List</h2>

      {/* Loading and Error messages */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* User List */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold text-lg">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Link to={`/edit/${user.id}`} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;

