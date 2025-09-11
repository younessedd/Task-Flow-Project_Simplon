import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={styles.input} />
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}

const styles = {
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', textAlign: 'center' },
  title: { marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer' },
  error: { color: 'red' }
};
