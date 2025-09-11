import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import Navbar from '../components/Navbar';

export default function Admin() {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // جلب جميع المستخدمين
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (e) {
        setError('Cannot fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (e) {
      setError('Cannot delete user');
    }
  };

  const toggleAdmin = async (u) => {
    try {
      const { data } = await api.put(`/users/${u.id}`, { is_admin: !u.is_admin });
      setUsers(users.map(user => user.id === u.id ? data : user));
    } catch (e) {
      setError('Cannot change role');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Admin Panel</h2>
        {error && <p style={styles.error}>{error}</p>}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.is_admin ? 'Admin' : 'User'}</td>
                <td style={styles.actions}>
                  <button style={styles.toggleButton} onClick={() => toggleAdmin(u)}>
                    {u.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
  },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  actions: { display: 'flex', gap: '10px' },
  toggleButton: {
    padding: '5px 10px',
    backgroundColor: '#ffc107',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  error: { color: 'red', textAlign: 'center', marginTop: '10px' },
  h2: { textAlign: 'center', marginBottom: '20px' },
};
