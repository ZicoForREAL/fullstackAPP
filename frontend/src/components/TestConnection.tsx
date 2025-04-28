import { useState } from 'react';
import api from '../axios';

const TestConnection = () => {
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const testConnection = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/test');
            setMessage(response.data.message);
        } catch (err) {
            setError('Failed to connect to backend. Please check the console for details.');
            console.error('Connection error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '2px solid red' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Backend Connection Test</h2>
            <button
                onClick={testConnection}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            {message && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda', color: '#155724' }}>
                    {message}
                </div>
            )}
            
            {error && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default TestConnection; 