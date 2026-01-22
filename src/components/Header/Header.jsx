import './Header.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/*
React props docs: https://www.w3schools.com/react/react_props.asp
React Router Navigation docs: https://reactrouter.com/api/hooks/useNavigate
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
        setMenuOpen(!menuOpen);
    }

    function toggleActivity() {
        setActivityOpen(!activityOpen);
    }

    return (
        <header className="header">
            <div className="header-left">
                <img src="/images/branding/logo.svg" alt="CloseKnit logo" className="logo" onClick={logoHome} />
                <img src="/images/ui/hamburger-menu.svg" alt="Menu" className="hamburger" onClick={toggleMenu} />
            </div>
            {/* template literal to pass the properties of the current circle into the header */}
            <div className="header-center">
                <h2 className='circle-name'>{`Current Circle: ${props.currentCircle}`}</h2>
                <h1 className="brand-text">CloseKnit</h1>
            </div>

            {/* Depending on how we approach the notification bell with the rest of the project, this could be a component itself that is imported in like the header but this is still TBD. For now, we can use a button & image combo to bring in the svg

            For the profile photo, I'm using a placeholder image until we set up the database and figure out the user profiles*/}
            <div className="header-right">
                <img src="/images/ui/notification-bell-false.svg" alt="notification bell" className="notifications" />
                <img src="/images/ui/user-pfp.svg" alt="Profile" className="profile-pic" />
                <img src="/images/ui/activity-feed-mobile.svg" alt="Activity Feed" className="activity-icon" onClick={toggleActivity} />
            </div>


            {/* These handle the sidebar and the activity feed with the boolean. So if the menu is opened to "true" when clicking the svg, the mobile view of those componenets will be displayed. If it's clicked again it will close.  */}
            {/* Conditional overlays */}
            {menuOpen && (
                <div className="mobile-menu">
                    {/*  sidebar component goes here once we make it. right now the buttons don't do anything but I tested they worked when clicked. */}
                </div>
            )}

            {activityOpen && (
                <div className="activity-feed">
                    {/*  sidebar component goes here once we make it */}
                </div>
            )}
        </header>
    );
}

export default Header