import React from 'react';

function LandingPage({ onSelectRole, onGoogleSignIn, user }) {
  return (
    <div className="landing-page">
      <h1 className="landing-title">Welcome to HelloServe</h1>
      <button className="submit-btn" style={{marginBottom: 32}} onClick={onGoogleSignIn}>
        Sign in with Google
      </button>
      {user && (
        <div style={{color: '#fff', marginBottom: 24}}>
          Signed in as: {user.displayName} ({user.email})
        </div>
      )}
      <div className="role-selection">
        <div className="role-block owner-block" onClick={() => onSelectRole('owner')}>
          <h2>Owner</h2>
          <p>List your parking space and earn</p>
        </div>
        <div className="role-block renter-block" onClick={() => onSelectRole('renter')}>
          <h2>Renter</h2>
          <p>Find and book a parking space</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
