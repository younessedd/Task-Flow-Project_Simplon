import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      {/* زر إنشاء مهمة جديدة */}
      <button
        style={styles.addButton}
        onClick={() => navigate('/tasks/new')}
      >
        Add New Task
      </button>

      {/* الترحيب باليوزر في الوسط */}
      <div style={styles.welcome}>
        Welcome, {user.name} ({user.is_admin ? 'Admin' : 'User'})
      </div>

      {/* زر تسجيل الخروج */}
      <button
        style={styles.logoutButton}
        onClick={logout}
      >
        Logout
      </button>
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    width: '100%',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    minWidth: '120px',
    transition: '0.3s',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    minWidth: '120px',
    transition: '0.3s',
  },
  welcome: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    flexGrow: 1,
    color: '#333',
  },
};
