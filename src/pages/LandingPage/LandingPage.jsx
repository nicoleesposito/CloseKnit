import './LandingPage.css'
import { Link } from "react-router-dom"

function LandingPage() {
    // any states, hooks, or JS needed would go in this area here

    return (
        <div>
            <div>
                <h1>Landing Page is working test!</h1>
                <h2> These act as buttons to navigate to other pages for testing. These can be removed as the landing page is built.</h2>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/managecircles">Manage Circles</Link></li>
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/journal">Journal</Link></li>
                    <li><Link to="/memoryboard">Memory Board</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </div>
        </div>
    );
}

export default LandingPage