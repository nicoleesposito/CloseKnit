import './Journal.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';

function Journal(props) {
    //any states, hooks, or JS needed would go in this area here

    return (
        <div>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="journal" />
                <main className='manage-main'>
                    <h1>Journal is working!</h1>
                </main>
                <ActivityFeed />
            </div>
        </div>
    );
}

export default Journal