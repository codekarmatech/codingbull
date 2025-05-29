import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [results, setResults] = useState({
    directFetch: null,
    directFetchWithV1: null,
    error: null
  });

  useEffect(() => {
    const testApis = async () => {
      try {
        // Test direct fetch without /v1
        try {
          const response1 = await fetch('http://localhost:8000/api/categories/');
          const data1 = await response1.json();
          setResults(prev => ({ ...prev, directFetch: data1 }));
        } catch (error) {
          setResults(prev => ({ ...prev, directFetch: `Error: ${error.message}` }));
        }

        // Test direct fetch with /v1
        try {
          const response2 = await fetch('http://localhost:8000/api/v1/categories/');
          const data2 = await response2.json();
          setResults(prev => ({ ...prev, directFetchWithV1: data2 }));
        } catch (error) {
          setResults(prev => ({ ...prev, directFetchWithV1: `Error: ${error.message}` }));
        }
      } catch (error) {
        setResults(prev => ({ ...prev, error: error.message }));
      }
    };

    testApis();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '400px',
      fontSize: '12px'
    }}>
      <h3>API Test Results</h3>
      <div>
        <h4>Direct Fetch (without /v1):</h4>
        <pre>{JSON.stringify(results.directFetch, null, 2)}</pre>
      </div>
      <div>
        <h4>Direct Fetch (with /v1):</h4>
        <pre>{JSON.stringify(results.directFetchWithV1, null, 2)}</pre>
      </div>
      {results.error && (
        <div>
          <h4>Error:</h4>
          <pre>{results.error}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;