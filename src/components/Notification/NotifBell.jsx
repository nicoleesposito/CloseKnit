import React, { useState } from 'react';
import './NotifBell.css';
// Worked on by Michelle
function NotifBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  function toggleNotifications() {
    setIsOpen(!isOpen);
  }

  function markAsRead() {
    setHasUnread(false);
    setIsOpen(false);
  }

  return (
    <div className="notif-bell-container">
      <img
        src={hasUnread ? "/images/ui/notification-bell-true.svg" : "/images/ui/notification-bell-false.svg"}
        alt="notification bell"
        className="notif-bell-icon"
        onClick={toggleNotifications}
      />
      
      {isOpen && (
        <>
          <div className="notif-overlay" onClick={() => setIsOpen(false)}></div>
          
          <div className="notif-popup">
            <div className="notif-header">
              <h3>Notifications</h3>
              <button className="notif-close" onClick={() => setIsOpen(false)}>×</button>
            </div>
            
            <div className="notif-list">
              <div className="notif-item notif-item-new">
                <div className="notif-item-content">
                  <p className="notif-item-text">
                    <span className="notif-user">System</span> Update version 2.0: Layout improvements"
                  </p>
                  <p className="notif-item-time">6 hours ago</p>
                </div>
                <div className="notif-dot"></div>
              </div>

              <div className="notif-item">
                <div className="notif-item-content">
                  <p className="notif-item-text">
                    <span className="notif-user">System</span> Reminder: Birthday party tomorrow at 3:00 PM
                  </p>
                  <p className="notif-item-time">7 hours ago</p>
                </div>
              </div>
            </div>
            
            <div className="notif-footer">
              <button className="notif-mark-read" onClick={markAsRead}>Mark all as read</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotifBell;