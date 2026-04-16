import React, { useState, useEffect, useCallback } from 'react';
import './NotifBell.css';
// Worked on by Michelle

const DISMISSED_KEY = 'notif_dismissed';

function getDismissed() {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  return days + 'd ago';
}

function NotifBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState(getDismissed);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark-mode'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const visible = notifications.filter(n => !dismissed.includes(n.id));
  const hasUnread = visible.length > 0;

  function markAsRead() {
    const ids = visible.map(n => n.id);
    const next = [...dismissed, ...ids];
    setDismissed(next);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    setIsOpen(false);
  }

  function toggleNotifications() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="notif-bell-container">
      <img
        src={
          isDark
            ? (hasUnread ? "/images/ui/notification-bell-true-darktheme.svg" : "/images/ui/notification-bell-false-darktheme.svg")
            : (hasUnread ? "/images/ui/notification-bell-true.svg" : "/images/ui/notification-bell-false.svg")
        }
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
              {visible.length === 0 ? (
                <p className="notif-empty">No notifications to see here!</p>
              ) : (
                visible.map(n => (
                  <div key={n.id} className="notif-item notif-item-new">
                    <div className="notif-dot"></div>
                    <div className="notif-item-content">
                      <p className="notif-item-text">{n.text}</p>
                      <p className="notif-item-time">{formatTime(n.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
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
