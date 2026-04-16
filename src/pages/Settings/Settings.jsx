import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/useAuth";


function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Account");
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    city: "",
    timezone: "",
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    pushNotifications: localStorage.getItem('notif_pushNotifications') !== 'false',
    soundAlerts: localStorage.getItem('notif_soundAlerts') !== 'false',
    activityUpdates: localStorage.getItem('notif_activityUpdates') !== 'false',
    closeKnitUpdates: localStorage.getItem('notif_closeKnitUpdates') !== 'false',
  });

  // Accessibility toggles
  const [accessibility, setAccessibility] = useState({
    darkMode: localStorage.getItem('darkMode') === 'true',
    largerText: localStorage.getItem('largerText') === 'true',
  });

  const [profilePic, setProfilePic] = useState(user?.profilePicture || "/images/profile-picture.jpg");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }));
      if (user.profilePicture) {
        setProfilePic(user.profilePicture);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formPayload = new FormData();
    formPayload.append('image', file);

    try {
      const res = await fetch('/api/users/profile-picture', {
        method: 'PATCH',
        credentials: 'include',
        body: formPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setProfilePic(data.profilePicture);
      updateUser({ ...user, profilePicture: data.profilePicture });
    } catch (err) {
      console.error('Profile picture upload failed:', err.message);
    }
  };

  const handleSaveName = async () => {
    setSaveError("");
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName, email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      updateUser({ ...user, firstName: data.firstName, lastName: data.lastName, email: data.email });
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const res = await fetch('/api/users/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPasswordData({ currentPassword: "", newPassword: "" });
      setIsEditingPassword(false);
      setPasswordSuccess("Password updated successfully.");
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profile-pic-input").click();
  };

  const handleNotificationToggle = (name) => {
    setNotifications((prev) => {
      const next = !prev[name];
      localStorage.setItem(`notif_${name}`, String(next));
      return { ...prev, [name]: next };
    });
  };

  const handleAccessibilityToggle = (name) => {
    setAccessibility((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Logout handler
  const handleLogout = () => {

    // Navigate to landing page
    navigate("/");
  };

  // Apply dark mode to the document
  useEffect(() => {
    if (accessibility.darkMode) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem('darkMode', 'false');
    }
  }, [accessibility.darkMode]);

  // Apply larger text to the document
  useEffect(() => {
    if (accessibility.largerText) {
      document.documentElement.classList.add("larger-text");
      localStorage.setItem('largerText', 'true');
    } else {
      document.documentElement.classList.remove("larger-text");
      localStorage.setItem('largerText', 'false');
    }
  }, [accessibility.largerText]);

  return (
    <div className="settings-container">
      <Navbar activePage="settings" />

      <main className="settings-main">
        <div className="settings-header">
          <h1>Settings</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab ${activeTab === "Account" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Account")}
          >
            Account
          </button>
          <button
            className={`tab ${activeTab === "Notifications" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Notifications")}
          >
            Notifications
          </button>
          <button
            className={`tab ${activeTab === "Accessibility" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Accessibility")}
          >
            Accessibility
          </button>
          <button
            className={`tab ${activeTab === "Privacy" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Privacy")}
          >
            Privacy
          </button>
        </div>

        {/* ================= ACCOUNT Section================= */}
        {activeTab === "Account" && (
          <div className="settings-content">
            <section className="settings-section">
              <div className="section-header">
                <div>
                  <h2 className="settings-section-title">
                    Profile Information
                  </h2>
                  <p className="section-subtitle">Set account details</p>
                </div>
                {isEditing ? (
                  <button className="edit-btn" onClick={handleSaveName}>Save</button>
                ) : (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                )}
              </div>

              <div className="profile-container">
                <div className="profile-info">
                  <div
                    className="profile-pic-wrapper"
                    onClick={triggerFileInput}
                  >
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="profile-picture"
                    />
                    <div className="profile-pic-overlay">
                      <span>Change Photo</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    id="profile-pic-input"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    style={{ display: "none" }}
                  />
                  <div className="profile-details">
                    <h3>{user?.firstName} {user?.lastName}</h3>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="profile-form">
                  {saveError && <div style={{ color: 'red', marginBottom: '10px' }}>{saveError}</div>}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <div className="section-header">
                <div>
                  <h2 className="settings-section-title">Password</h2>
                  <p className="section-subtitle">
                    For your security, you can update your password anytime.
                  </p>
                </div>
                {isEditingPassword ? (
                  <button className="edit-btn" onClick={handleSavePassword}>Save</button>
                ) : (
                  <button className="update-password-btn" onClick={() => { setIsEditingPassword(true); setPasswordError(""); setPasswordSuccess(""); }}>Update Password</button>
                )}
              </div>
              {passwordSuccess && !isEditingPassword && (
                <div style={{ color: 'green', marginTop: '8px' }}>{passwordSuccess}</div>
              )}
              {isEditingPassword && (
                <div className="profile-form">
                  {passwordError && <div style={{ color: 'red', marginBottom: '10px' }}>{passwordError}</div>}
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                </div>
              )}
            </section>

            <section className="settings-section">
              <div className="section-header">
                <div>
                  <h2 className="settings-section-title">
                    Timezone & Preferences
                  </h2>
                  <p className="section-subtitle">
                    Change your time zone and formatting
                  </p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="timezone">Timezone</label>
                  <input
                    type="text"
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= NOTIFICATIONS Section ================= */}
        {activeTab === "Notifications" && (
          <div className="settings-content">
            <section className="notification-section">
              <h2 className="notification-section-title">Alerts</h2>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Push Notifications</h3>
                  <p>
                    Sends alerts in the background when new updates are
                    available.
                  </p>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.pushNotifications ? "On" : "Off"}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={() =>
                        handleNotificationToggle("pushNotifications")
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Sound Alerts</h3>
                  <p>
                    Play a notification sound when a new update is received.
                  </p>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.soundAlerts ? "On" : "Off"}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.soundAlerts}
                      onChange={() => handleNotificationToggle("soundAlerts")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </section>

            <section className="notification-section">
              <h2 className="notification-section-title">Notification Types</h2>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Activity Updates</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.activityUpdates ? "On" : "Off"}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.activityUpdates}
                      onChange={() =>
                        handleNotificationToggle("activityUpdates")
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>CloseKnit Updates</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.closeKnitUpdates ? "On" : "Off"}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications.closeKnitUpdates}
                      onChange={() =>
                        handleNotificationToggle("closeKnitUpdates")
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= ACCESSIBILITY Section================= */}
        {activeTab === "Accessibility" && (
          <div className="settings-content">
            <section className="settings-section">
              <div className="accessibility-header">
                <h2 className="accessibility-section-title">Language</h2>
                <p className="accessibility-subtitle">
                  Default language for your account
                </p>
              </div>
              <div className="language-select-container">
                <select className="language-select">
                  <option value="en-US">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </section>

            <section className="settings-section">
              <h2 className="display-title">Display</h2>

              <div className="display-item">
                <div className="display-info">
                  <h3>Dark Mode</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {accessibility.darkMode ? "On" : "Off"}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={accessibility.darkMode}
                      onChange={() => handleAccessibilityToggle("darkMode")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="display-item">
                <div className="display-info">
                  <h3>Larger Text</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {accessibility.largerText ? "On" : "Off"}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={accessibility.largerText}
                      onChange={() => handleAccessibilityToggle("largerText")}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= PRIVACY Section ================= */}
        {activeTab === "Privacy" && (
          <div className="settings-content">
            <section className="privacy-section">
              <h2 className="privacy-title">Privacy Policy</h2>
              <p className="privacy-intro">
                Your privacy is important to us. This Privacy Policy explains
                how we collect, use, and protect your information when you use
                our website and app.
              </p>

              <div className="privacy-item">
                <h3>1. Information we collect</h3>
                <p>
                  We collect information to help you connect and share safely
                  with your circles. This may include:
                </p>
                <ul>
                  <li>
                    Account Information: Name, email address, and password when
                    you create an account.
                  </li>
                  <li>
                    Profile Details: Optional information you choose to add,
                    such as a photo.
                  </li>
                  <li>
                    Device Information: Browser type, device type, and operating
                    system for functionality.
                  </li>
                </ul>
              </div>

              <div className="privacy-item">
                <h3>2. How we use your information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Create and maintain your CloseKnit account.</li>
                  <li>
                    Allow you to connect and share updates with your circles.
                  </li>
                  <li>Improve our features, design, and functionality.</li>
                  <li>Provide customer support when needed.</li>
                  <li>
                    Send important notifications or updates about your account.
                  </li>
                </ul>
                <p>
                  We do not sell your personal information to third parties.
                </p>
              </div>

              <div className="privacy-item">
                <h3>3. Sharing and Visibility</h3>
                <p>
                  Your content is only visible to the people you add to your
                  circles and no one else. We may monitor content for safety if
                  deemed necessary.
                </p>
              </div>

              <div className="privacy-item">
                <h3>4. Data Security</h3>
                <p>
                  We use encryption and other security measures to protect your
                  data from unauthorized access, loss, or misuse. However, no
                  online platform is 100% secure. We encourage users to protect
                  their account by using a strong password and keeping login
                  details private.
                </p>
              </div>

              <div className="privacy-item">
                <h3>5. Cookies</h3>
                <p>
                  We may use cookies or similar technologies to enhance user
                  experience and remember preferences. You can control or
                  disable cookies in your browser settings.
                </p>
              </div>

              <div className="privacy-item">
                <h3>6. Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                  <li>Access, edit, or delete your account information.</li>
                  <li>Manage who can view your shared content.</li>
                  <li>
                    Request deletion of your data at any time by contacting us.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default Settings;
