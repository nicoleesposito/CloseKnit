import './Settings.css'
import Navbar from '../../components/Navbar/Navbar';

function Settings() {
    // any states, hooks, or JS needed would go in this area here

    return (
        <div>
            {/* html output mixed with any JS here
            I didn't add in the header because the figma has a differently styled one. to be continued later */}
            <div className="manage-layout">
                <Navbar activePage="settings" />
                <main className='manage-main'>
                    <h1>Settings is working!</h1>
                </main>
            </div>
        </div>
    );
}

export default Settings