import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (e) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (task) => {
    let newStatus;
    if (task.status === 'todo') newStatus = 'in_progress';
    else if (task.status === 'in_progress') newStatus = 'done';
    else newStatus = 'todo';

    try {
      await api.post(`/tasks/${task.id}/status`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );
    } catch (e) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (e) {
      setError('Failed to delete task');
    }
  };

  const canEditOrDelete = (task) => {
    return user.is_admin || task.created_by === user.id || task.assigned_to === user.id;
  };

  const statusColor = (status, type = 'card') => {
    switch (status) {
      case 'todo':
        return type === 'card' ? '#d4edda' : '#28a745';
      case 'in_progress':
        return type === 'card' ? '#fff3cd' : '#ffc107';
      case 'done':
        return type === 'card' ? '#f8d7da' : '#dc3545';
      default:
        return '#f0f0f0';
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        {error && <p style={styles.error}>{error}</p>}
       {/*  <button
          style={styles.createButton}
          onClick={() => navigate('/tasks/new')}
        >
          Create New Task
        </button> */}
        <div style={styles.tasksGrid}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{ ...styles.card, backgroundColor: statusColor(task.status, 'card') }}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>
                Start: {task.start_date} - End: {task.end_date}
              </p>
              <p>Created by: {task.creator_name}</p>
              <p>Assigned to: {task.assignee_name || task.creator_name}</p>
              <p>Status: {task.status}</p>
              <button
                style={{ ...styles.statusButton, backgroundColor: statusColor(task.status, 'button') }}
                onClick={() => handleChangeStatus(task)}
              >
                Change Status
              </button>
              {canEditOrDelete(task) && (
                <div style={styles.actions}>
                  <button style={styles.editButton} onClick={() => navigate(`/tasks/${task.id}/edit`)}>
                    Edit
                  </button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '20px auto', padding: '10px' },
  createButton: {
    padding: '10px 20px',
    marginBottom: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  tasksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '15px',
  },
  card: {
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  statusButton: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
    marginBottom: '10px',
    transition: '0.3s',
  },
  actions: { display: 'flex', gap: '10px' },
  editButton: {
    padding: '6px 12px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#17a2b8',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  deleteButton: {
    padding: '6px 12px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  error: { color: 'red', textAlign: 'center' },
};
