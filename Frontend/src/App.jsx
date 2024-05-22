import React, { useState, useEffect } from 'react';

function App() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/logout';
  };

  return (
    <div className='app'>
      <h1>Login with Google Oauth</h1>
      <div className="buttons">
        <button className='button login' onClick={handleLogin}>Login</button>
        <button className='button login' onClick={handleLogout}>Logout</button>
      </div>
      <ProtectedContent />
    </div>
  );
}

function ProtectedContent() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/protected', {
      credentials: 'include'
    })
      .then(response => response.text())
      .then(data => setContent(data))
      .catch(error => console.log(error));
  }, []);

  return <div>{content}</div>;
}

export default App;
