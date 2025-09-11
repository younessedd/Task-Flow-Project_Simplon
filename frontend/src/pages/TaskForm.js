import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function TaskForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // جلب قائمة المستخدمين العاديين فقط
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users'); // جلب جميع المستخدمين
        const normalUsers = data.filter((u) => !u.is_admin); // فقط Users
        setUsers(normalUsers);
      } catch (e) {
        console.error('Error fetching users', e);
      }
    };
    fetchUsers();
  }, []);

  // إذا كان تعديل، جلب بيانات المهمة
  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const { data } = await api.get(`/tasks/${id}`);
          setTitle(data.title);
          setDescription(data.description);
          setStartDate(data.start_date);
          setEndDate(data.end_date);
          setAssignedTo(data.assigned_to || '');
        } catch (e) {
          setError('Cannot fetch task');
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      assigned_to: assignedTo || user.id, // إذا لم يُختَر أحد -> Creator
    };

    try {
      if (id) await api.put(`/tasks/${id}`, payload);
      else await api.post('/tasks', payload);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Error saving task');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>{id ? 'Edit Task' : 'Create Task'}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
          <label>Assign To:</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={styles.select}
          >
            <option value="">None</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} (User)
              </option>
            ))}
          </select>
          <div style={styles.buttons}>
            <button type="submit" style={styles.saveButton}>
              Save
            </button>
            <button
              type="button"
              style={styles.backButton}
              onClick={() => navigate('/')}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
  },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    minHeight: '80px',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  buttons: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  error: { color: 'red', textAlign: 'center' },
};
