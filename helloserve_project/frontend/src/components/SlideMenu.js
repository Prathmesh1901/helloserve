import React from 'react';
import './AppStyles.css';

function SlideMenu({ open, user, onSignOut, onSelectRole, onClose }) {
  return (
    <div className={`slide-menu${open ? ' open' : ''}`}>  
      <div className="slide-menu-header">
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      <div className="slide-menu-user">
        <div className="user-avatar">{user?.displayName?.[0] || 'U'}</div>
        <div className="user-info">
          <div className="user-name">{user?.displayName || 'User'}</div>
          <div className="user-email">{user?.email || ''}</div>
        </div>
      </div>
      <div className="slide-menu-options">
        <button className="menu-btn" onClick={() => onSelectRole('owner')}>Property Owner</button>
        <button className="menu-btn" onClick={() => onSelectRole('renter')}>Car Owner</button>
        <button className="menu-btn signout-btn" onClick={onSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default SlideMenu;
