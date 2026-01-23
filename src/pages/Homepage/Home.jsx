import './Home.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from "react-router-dom";

function Home(props) {
    // any states, hooks, or JS needed would go in this area here
    let navigate = useNavigate();

    // temporary function to navigate back to the landing page.
    function landingLink() {
        navigate("/");
    }

    return (
        <div>
            {/* html output mixed with any JS here.*/}
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="home" />
                <main className='manage-main'>
                    <h2 onClick={landingLink}>Home works! Click to go to Landing Page (start area)</h2>
                </main>
            </div>
        </div>
    );
}

export default Home