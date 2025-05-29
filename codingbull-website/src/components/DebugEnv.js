import React from 'react';
import config from '../config/environment';

const DebugEnv = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '400px',
      fontSize: '12px'
    }}>
      <h3>Environment Debug</h3>
      <pre>
        {JSON.stringify({
          processEnv: {
            REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
            NODE_ENV: process.env.NODE_ENV
          },
          config: {
            api: config.api,
            env: config.env
          },
          apiServiceBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1'
        }, null, 2)}
      </pre>
    </div>
  );
};

export default DebugEnv;