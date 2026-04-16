import './Navbar.css'
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';

function Navbar(props) {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchFetched, setSearchFetched] = useState(false);
    const searchRef = useRef(null);

    // close dropdown when clicking outside the search area
    useEffect(function () {
        function handleOutsideClick(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return function () {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    // debounced search: wait 300ms after the user stops typing before fetching
    useEffect(function () {
        const trimmed = searchText.trim();

        if (trimmed.length < 2 || !props.activeCircleId) {
            setSearchResults([]);
            setSearchOpen(false);
            setSearchFetched(false);
            return;
        }

        const timer = setTimeout(async function () {
            const query = trimmed.toLowerCase();
            const circleId = props.activeCircleId;
            const combined = [];

            try {
                const [journalRes, boardRes, calendarRes] = await Promise.all([
                    fetch('/api/circles/' + circleId + '/journal', { credentials: 'include' }),
                    fetch('/api/circles/' + circleId + '/memoryboard', { credentials: 'include' }),
                    fetch('/api/circles/' + circleId + '/calendar', { credentials: 'include' })
                ]);

                if (journalRes.ok) {
                    const entries = await journalRes.json();
                    entries.forEach(function (entry) {
                        const titleMatch = entry.titleText && entry.titleText.toLowerCase().includes(query);
                        const descMatch = entry.shortDescriptionText && entry.shortDescriptionText.toLowerCase().includes(query);
                        if (titleMatch || descMatch) {
                            combined.push({ type: 'Journal', label: entry.titleText || t('nav.untitled'), path: '/journal' });
                        }
                    });
                }

                if (boardRes.ok) {
                    const boards = await boardRes.json();
                    boards.forEach(function (board) {
                        if (board.titleText && board.titleText.toLowerCase().includes(query)) {
                            combined.push({ type: 'Board', label: board.titleText, path: '/memoryboard' });
                        }
                    });
                }

                if (calendarRes.ok) {
                    const events = await calendarRes.json();
                    events.forEach(function (event) {
                        if (event.title && event.title.toLowerCase().includes(query)) {
                            combined.push({ type: 'Calendar', label: event.title, path: '/calendar' });
                        }
                    });
                }
            } catch {
                // silently ignore fetch errors in search
            }

            setSearchResults(combined.slice(0, 8));
            setSearchOpen(combined.length > 0);
            setSearchFetched(true);
        }, 300);

        return function () {
            clearTimeout(timer);
        };
    }, [searchText, props.activeCircleId]);

    function handleSearchChange(changeEvent) {
        setSearchText(changeEvent.target.value);
    }

    function handleResultClick(path) {
        setSearchText('');
        setSearchResults([]);
        setSearchOpen(false);
        setSearchFetched(false);
        goTo(path);
    }

    function typeLabel(type) {
        if (type === 'Journal') return 'nav-result-tag nav-result-tag-journal';
        if (type === 'Board') return 'nav-result-tag nav-result-tag-board';
        return 'nav-result-tag nav-result-tag-calendar';
    }

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
            <div className="nav-search-wrap" ref={searchRef}>
            <div className="nav-search">
                <img src='/images/ui/search.svg' alt="Magnifying glass search icon" />
                <input
                    type='text'
                    placeholder={t('nav.search')}
                    className='search-input'
                    value={searchText}
                    onChange={handleSearchChange}
                    autoComplete="off"
                />
            </div>
            {searchOpen && searchResults.length > 0 && (
                <div className="nav-search-dropdown">
                    {searchResults.map(function (result, index) {
                        return (
                            <button
                                key={index}
                                className="nav-result-row"
                                type="button"
                                onClick={function () { handleResultClick(result.path); }}
                            >
                                <span className={typeLabel(result.type)}>{result.type}</span>
                                <span className="nav-result-label">{result.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
            {searchFetched && searchResults.length === 0 && (
                <div className="nav-search-dropdown">
                    <p className="nav-result-empty">{t('nav.noResults')}</p>
                </div>
            )}
            </div>
            <div className="links">
                {/* "home" is passed through the function isActive which will match the button's class name to the active page (from the active jsx file). if it matches exactly then it will update which one gets highlighted by changing the class name to the one being returned from the function*/}
                <button className={isActive("home")} onClick={function () { goTo("/home"); }}><img src='/images/ui/home.svg' alt="Home button icon" /> {t('nav.home')}</button>

                <button className={isActive("managecircles")} onClick={function () { goTo("/managecircles"); }}><img src='/images/ui/preferences.svg' alt="Manage Circles button icon" />{t('nav.manageCircles')}</button>

                <div className="nav-divider"></div>

                <button className={isActive("calendar")} onClick={function () { goTo("/calendar"); }}> <img src='/images/ui/calendar.svg' alt="Calendar button icon" />{t('nav.calendar')}</button>

                <button className={isActive("journal")} onClick={function () { goTo("/journal"); }}><img src='/images/ui/journal.svg' alt="Journal button icon" />{t('nav.journal')}</button>

                <button className={isActive("memoryboard")} onClick={function () { goTo("/memoryboard"); }}><img src='/images/ui/edit-image.svg' alt="Memoryboard button icon" />{t('nav.memoryBoard')}</button>

                <div className="nav-divider"></div>

                <button className={isActive("settings")} onClick={function () { goTo("/settings"); }}><img src='/images/ui/settings.svg' alt="Settings button icon" />{t('nav.settings')}</button>

                <div className="nav-divider"></div>
            </div>

        </aside>
    );
}

export default Navbar