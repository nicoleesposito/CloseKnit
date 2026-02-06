import './Header.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from '../Navbar/Navbar';
import ActivityFeed from '../Activity Feed/ActivityFeed';
import NotifBell from '../Notification/NotifBell';

/*
React props docs: https://www.w3schools.com/react/react_props.asp
React Router useNavigate docs: https://reactrouter.com/api/hooks/useNavigate
- Worked on by Nicole

* Attempted to use Link and ahref to move from page to page but the state wasn't updating properly across each page (it returned undefined). It works using react router navigation though!

Props are like  arguments that are passed into the components, so the component will receive the argument as "props" and pass the data.
*/

function Header(props) {
    let navigate = useNavigate();

    function logoHome() {
        navigate("/home");
    }

    // I made booleans to flag for if the menu is open or closed. This is important for when we incorporate the sidebar component as an overlay in the mobile view. There is also the toggle for when the svg is clicked again.
    const [menuOpen, setMenuOpen] = useState(false);
    const [activityOpen, setActivityOpen] = useState(false);

    function toggleMenu() {
        if (activityOpen === true) {
            setActivityOpen(false);
        }
        setMenuOpen(!menuOpen);
    }

    function toggleActivity() {
        if (menuOpen === true) {
            setMenuOpen(false);
        }
        setActivityOpen(!activityOpen);
    }

    // these variables control which icons show in mobile view
    let hamburgerIcon = "/images/ui/hamburger-menu.svg";
    let activityIcon = "/images/ui/activity-feed-mobile.svg";

    if (menuOpen === true) {
        hamburgerIcon = "/images/ui/remove-button.svg";
    }

    if (activityOpen === true) {
        activityIcon = "/images/ui/remove-button.svg";
    }

    // these variables add a class name when the icon is open (had to add in because mobile sizing was off and applied two classes to the same icon)
    let hamburgerClassName = "hamburger";
    let activityClassName = "activity-icon";

    if (menuOpen === true) {
        hamburgerClassName = "hamburger hamburger-open";
    }

    if (activityOpen === true) {
        activityClassName = "activity-icon activity-open";
    }

    return (
        <header className="header">
            <div className="header-left">
                <img src="/images/branding/logo.svg" alt="CloseKnit logo" className="logo-header" onClick={logoHome} />

          {/* hides the hamburger icon when the activity feed is open */}
          {activityOpen === false && (
            <img
              src={hamburgerIcon}
              alt="Menu"
              className={hamburgerClassName}
              onClick={toggleMenu}
            />
          )}
        </div>

        {/* used a template literal to pass the properties of the current circle into the header */}
        <div className="header-center">
          <h2 className="header-circle-name">{`Current Circle: ${props.currentCircle}`}</h2>

          {/* hide title on mobile when either overlay is open. if they're not open, the title stays on the header */}
          {menuOpen === false && activityOpen === false && (
            <h1 className="brand-text">CloseKnit</h1>
          )}
        </div>

        {/* depending on how we approach the notification bell with the rest of the project, this could be a component itself that is imported in like the header but this is still TBD. For now, we can use a button & image combo to bring in the svg

            for the profile photo, I'm using a placeholder image until we set up the database and figure out the user profiles*/}
        <div className="header-right">
          <NotifBell />
          <img
            src="/images/ui/user-pfp.svg"
            alt="Profile"
            className="profile-pic"
          />

          {/* hide the activity icon when the hamburger menu is open */}
          {menuOpen === false && (
            <img
              src={activityIcon}
              alt="Activity Feed"
              className={activityClassName}
              onClick={toggleActivity}
            />
          )}
        </div>

        {/* these handle the sidebar and the activity feed with the boolean. So if the menu is opened to "true" when clicking the svg, the mobile view of those componenets will be displayed. If it's clicked again it will close.  */}
        {menuOpen && (
          <div className="mobile-menu">
            <Navbar
              activePage={props.activePage}
              onHamburgerClick={toggleMenu}
            />
          </div>
        )}

        {activityOpen && (
          <div className="activity-feed">
            <ActivityFeed />
          </div>
        )}
      </header>
    );
}

export default Header