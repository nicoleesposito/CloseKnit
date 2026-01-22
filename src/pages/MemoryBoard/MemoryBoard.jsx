import './MemoryBoard.css'
import Header from "../../components/Header/Header"

function MemoryBoard(props) {
    // any states, hooks, or JS needed would go in this area here

    return (
        <div>
            {/* html output mixed with any JS here */}
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <h1>Memory Board is working!</h1>
        </div>
    );
}

export default MemoryBoard