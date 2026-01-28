import './MemoryBoard.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';

function MemoryBoard(props) {
    // any states, hooks, or JS needed would go in this area here

    return (
        <div>
            {/* html output mixed with any JS here */}
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="memoryboard" />
                <main className='manage-main'>
                    <h1>Memory Board is working!</h1>
                </main>
                <ActivityFeed />
            </div>
        </div>
    );
}

export default MemoryBoard