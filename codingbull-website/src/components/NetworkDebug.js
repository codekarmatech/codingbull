import React, { useEffect, useState } from 'react';

const NetworkDebug = () => {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    // Create a proxy for the original fetch function
    const originalFetch = window.fetch;
    
    // Replace the global fetch with our instrumented version
    window.fetch = function instrumentedFetch(url, options) {
      // Record the request
      setRequests(prev => [...prev, { 
        url, 
        method: options?.method || 'GET',
        timestamp: new Date().toISOString()
      }]);
      
      // Call the original fetch
      return originalFetch(url, options);
    };
    
    // Restore the original fetch when the component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      left: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      fontSize: '12px'
    }}>
      <h3>Network Requests</h3>
      <button onClick={() => setRequests([])}>Clear</button>
      <ul style={{ padding: '0 0 0 20px' }}>
        {requests.map((req, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>
            <div><strong>{req.method}:</strong> {req.url}</div>
            <div><small>{req.timestamp}</small></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NetworkDebug;