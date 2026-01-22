import './Home.css'
import Header from "../../components/Header/Header"
import { useNavigate } from "react-router-dom";

function Home(props) {
    // any states, hooks, or JS needed would go in this area here
    let navigate = useNavigate();

    function landingLink() {
        navigate("/");
    }

    return (
        <div>
            {/* html output mixed with any JS here */}
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <h1>Home is working!</h1>
            <h2 onClick={landingLink}>Landing Page (start area)</h2>
        </div>
    );
}

export default Home