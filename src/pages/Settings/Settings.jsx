import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/LanguageContext";


function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { lang, setLanguage, t } = useLanguage();
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
    <div>
      <Header currentCircle="" activePage="settings" />
    <div className="settings-container">
      <Navbar activePage="settings" />

      <main className="settings-main">
        <div className="settings-header">
          <h1>{t('settings.title')}</h1>
          <button className="logout-btn" onClick={handleLogout}>
            {t('settings.logout')}
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab ${activeTab === "Account" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Account")}
          >
            {t('settings.account')}
          </button>
          <button
            className={`tab ${activeTab === "Notifications" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Notifications")}
          >
            {t('settings.notifications')}
          </button>
          <button
            className={`tab ${activeTab === "Accessibility" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Accessibility")}
          >
            {t('settings.accessibility')}
          </button>
          <button
            className={`tab ${activeTab === "Privacy" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Privacy")}
          >
            {t('settings.privacy')}
          </button>
        </div>

        {/* ================= ACCOUNT Section================= */}
        {activeTab === "Account" && (
          <div className="settings-content">
            <section className="settings-section">
              <div className="section-header">
                <div>
                  <h2 className="settings-section-title">
                    {t('settings.profileInformation')}
                  </h2>
                  <p className="section-subtitle">{t('settings.setAccountDetails')}</p>
                </div>
                {isEditing ? (
                  <button className="edit-btn" onClick={handleSaveName}>{t('settings.save')}</button>
                ) : (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>{t('settings.edit')}</button>
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
                      <span>{t('settings.changePhoto')}</span>
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
                      <label htmlFor="firstName">{t('settings.firstName')}</label>
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
                      <label htmlFor="lastName">{t('settings.lastName')}</label>
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
                    <label htmlFor="email">{t('settings.email')}</label>
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
                  <h2 className="settings-section-title">{t('settings.passwordSection')}</h2>
                  <p className="section-subtitle">
                    {t('settings.passwordSubtitle')}
                  </p>
                </div>
                {isEditingPassword ? (
                  <button className="edit-btn" onClick={handleSavePassword}>{t('settings.save')}</button>
                ) : (
                  <button className="update-password-btn" onClick={() => { setIsEditingPassword(true); setPasswordError(""); setPasswordSuccess(""); }}>{t('settings.updatePassword')}</button>
                )}
              </div>
              {passwordSuccess && !isEditingPassword && (
                <div style={{ color: 'green', marginTop: '8px' }}>{passwordSuccess}</div>
              )}
              {isEditingPassword && (
                <div className="profile-form">
                  {passwordError && <div style={{ color: 'red', marginBottom: '10px' }}>{passwordError}</div>}
                  <div className="form-group">
                    <label htmlFor="currentPassword">{t('settings.currentPassword')}</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">{t('settings.newPassword')}</label>
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
                    {t('settings.timezonePrefs')}
                  </h2>
                  <p className="section-subtitle">
                    {t('settings.timezoneSubtitle')}
                  </p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">{t('settings.city')}</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="timezone">{t('settings.timezone')}</label>
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
              <h2 className="notification-section-title">{t('settings.alerts')}</h2>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>{t('settings.pushNotifications')}</h3>
                  <p>
                    {t('settings.pushNotificationsDesc')}
                  </p>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.pushNotifications ? t('settings.on') : t('settings.off')}
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
                  <h3>{t('settings.soundAlerts')}</h3>
                  <p>
                    {t('settings.soundAlertsDesc')}
                  </p>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.soundAlerts ? t('settings.on') : t('settings.off')}
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
              <h2 className="notification-section-title">{t('settings.notificationTypes')}</h2>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>{t('settings.activityUpdates')}</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.activityUpdates ? t('settings.on') : t('settings.off')}
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
                  <h3>{t('settings.closeKnitUpdates')}</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {notifications.closeKnitUpdates ? t('settings.on') : t('settings.off')}
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
                <h2 className="accessibility-section-title">{t('settings.language')}</h2>
                <p className="accessibility-subtitle">
                  {t('settings.languageDefault')}
                </p>
              </div>
              <div className="language-select-container">
                <select className="language-select" value={lang} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">{t('settings.langEn')}</option>
                  <option value="es">{t('settings.langEs')}</option>
                </select>
              </div>
            </section>

            <section className="settings-section">
              <h2 className="display-title">{t('settings.display')}</h2>

              <div className="display-item">
                <div className="display-info">
                  <h3>{t('settings.darkMode')}</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {accessibility.darkMode ? t('settings.on') : t('settings.off')}
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
                  <h3>{t('settings.largerText')}</h3>
                </div>
                <div className="toggle-container">
                  <span className="toggle-status">
                    {accessibility.largerText ? t('settings.on') : t('settings.off')}
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
              <h2 className="privacy-title">{t('settings.privacyPolicy')}</h2>
              <p className="privacy-intro">
                {t('settings.privacyIntro')}
              </p>

              <div className="privacy-item">
                <h3>{t('settings.privacy1Title')}</h3>
                <p>{t('settings.privacy1Intro')}</p>
                <ul>
                  <li>{t('settings.privacy1Item1')}</li>
                  <li>{t('settings.privacy1Item2')}</li>
                  <li>{t('settings.privacy1Item3')}</li>
                </ul>
              </div>

              <div className="privacy-item">
                <h3>{t('settings.privacy2Title')}</h3>
                <p>{t('settings.privacy2Intro')}</p>
                <ul>
                  <li>{t('settings.privacy2Item1')}</li>
                  <li>{t('settings.privacy2Item2')}</li>
                  <li>{t('settings.privacy2Item3')}</li>
                  <li>{t('settings.privacy2Item4')}</li>
                  <li>{t('settings.privacy2Item5')}</li>
                </ul>
                <p>{t('settings.privacy2Footer')}</p>
              </div>

              <div className="privacy-item">
                <h3>{t('settings.privacy3Title')}</h3>
                <p>{t('settings.privacy3Text')}</p>
              </div>

              <div className="privacy-item">
                <h3>{t('settings.privacy4Title')}</h3>
                <p>{t('settings.privacy4Text')}</p>
              </div>

              <div className="privacy-item">
                <h3>{t('settings.privacy5Title')}</h3>
                <p>{t('settings.privacy5Text')}</p>
              </div>

              <div className="privacy-item">
                <h3>{t('settings.privacy6Title')}</h3>
                <p>{t('settings.privacy6Intro')}</p>
                <ul>
                  <li>{t('settings.privacy6Item1')}</li>
                  <li>{t('settings.privacy6Item2')}</li>
                  <li>{t('settings.privacy6Item3')}</li>
                </ul>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
    </div>
  );
}

export default Settings;
