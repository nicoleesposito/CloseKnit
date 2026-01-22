import './Journal.css'
import Header from "../../components/Header/Header"

function Journal(props) {
    // any states, hooks, or JS needed would go in this area here

    return (
        <div>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <h1>Journal is working!</h1>
        </div>
    );
}

export default Journal