import './Navbar.css'
import { useNavigate } from 'react-router-dom';

function Navbar(props) {
    const navigate = useNavigate()

    function isActive(pageName) {
        if (props.activePage === pageName) {
            return "navrow navrow-active";
        }
        return "navrow";
    }

    function goTo(path) {
        navigate(path);

        if (props.onHamburgerClick) {
            props.onHamburgerClick();
        }
    }


    return (
        <aside className='navbar'>
            <div className="nav-search">
                <img src='/images/ui/search.svg' alt="Magnifying glass search icon" />
                <input type='text' placeholder='Search for...' className='search-input' />
                {/* right now the search bar isn't coded to filter or find any content. to be worked on at a later point in time */}
            </div>
            <div className="links">
                {/* "home" is passed through the function isActive which will match the button's class name to the active page (from the active jsx file). if it matches exactly then it will update which one gets highlighted by changing the class name to the one being returned from the function*/}
                <button className={isActive("home")} onClick={function () { goTo("/home"); }}><img src='/images/ui/home.svg' alt="Home button icon" /> Home</button>

                <button className={isActive("managecircles")} onClick={function () { goTo("/managecircles"); }}><img src='/images/ui/preferences.svg' alt="Manage Circles button icon" />Manage Circles</button>

                <div className="nav-divider"></div>

                <button className={isActive("calendar")} onClick={function () { goTo("/calendar"); }}> <img src='/images/ui/calendar.svg' alt="Calendar button icon" />Calendar</button>

                <button className={isActive("journal")} onClick={function () { goTo("/journal"); }}><img src='/images/ui/journal.svg' alt="Journal button icon" />Journal</button>

                <button className={isActive("memoryboard")} onClick={function () { goTo("/memoryboard"); }}><img src='/images/ui/edit-image.svg' alt="Memoryboard button icon" />Memory Board</button>

                <div className="nav-divider"></div>

                <button className={isActive("settings")} onClick={function () { goTo("/settings"); }}><img src='/images/ui/settings.svg' alt="Settings button icon" />Settings</button>

                <div className="nav-divider"></div>
            </div>

        </aside>
    );
}

export default Navbar