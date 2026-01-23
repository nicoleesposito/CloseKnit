import './ManageCircles.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';

/*
React props docs: https://www.w3schools.com/react/react_props.asp
React Router Navigation docs: https://reactrouter.com/api/hooks/useNavigate
- Worked on by Nicole

Props are like  arguments that are passed into the components, so the component will receive the argument as "props" and pass the data.
*/

function ManageCircles(props) {
    // this function controls the updated name for the circle. changeEvent is the user's action that is stored into the variable. then we grab the value of it and put it into another variable. Once we have that, we set the circle name to the new value that the user typed.
    function circleNameChange(changeEvent) {
        const inputText = changeEvent.target;
        const inputValue = inputText.value;

        props.setCircleName(inputValue);
    }
    // circleName properties is grabbed (from app.jsx), and the state for it updates as the circle's name gets updated. active page is also updated and passed through the isActive function on the navbar.
    return (
        <div>
            <Header currentCircle={props.circleName} profileImage="#" activePage="managecircles" />
            <div className="manage-layout">
                <Navbar activePage="managecircles" />
                <main className='manage-main'>
                    <input type="text" value={props.circleName} onChange={circleNameChange}
                    />
                </main>
            </div>
        </div>
    );
}

export default ManageCircles