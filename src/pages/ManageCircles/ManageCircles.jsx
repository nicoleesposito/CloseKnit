import './ManageCircles.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useState } from "react";

/*
React props docs: https://www.w3schools.com/react/react_props.asp
React Router Navigation docs: https://reactrouter.com/api/hooks/useNavigate
- Worked on by Nicole

Props are like arguments that are passed into the components, so the component will receive the argument as "props" and pass the data.
*/

function ManageCircles(props) {
    const [circleNameEditingEnabled, setCircleNameEditingEnabled] = useState(false);
    // stores the circle name text while the user is editing before it saves, which will then update the circle name property across the header once it's saved.
    const [circleNameDraftText, setCircleNameDraftText] = useState(props.circleName);
    const [createCircleModeEnabled, setCreateCircleModeEnabled] = useState(false);
    const [addMember, setAddMember] = useState("");
    const [circleMembersList, setCircleMembersList] = useState([]);
    const editIconImagePath = "/images/ui/edit-button-purple.svg";


    // updates the circle name draft text as the user types.
    function circleNameDraftChange(changeEvent) {
        const inputTextElement = changeEvent.target;
        const inputTextValue = inputTextElement.value;

        setCircleNameDraftText(inputTextValue);
    }

    // when the user types into the Add Member email input, this function runs to grab the new member information and eventually set it in the members area.
    function addMemberEmail(changeEvent) {
        const inputTextElement = changeEvent.target;
        const inputTextValue = inputTextElement.value;

        setAddMember(inputTextValue);
    }

    // switches the edit icon into a save button and saves the circle name when pressed again.
    function editOrSaveButton() {

        // if editing is off, turn on editing abilities to active and load the current name into the draft area to be edited.
        if (circleNameEditingEnabled === false) {
            setCircleNameEditingEnabled(true);
            setCircleNameDraftText(props.circleName);
            return;
        }

        // with editing is on, save the draft name into the global circle name state.
        props.setCircleName(circleNameDraftText);
        setCircleNameEditingEnabled(false);
    }

    function createNewCircleButton() {
        setCreateCircleModeEnabled(true);
        setCircleNameEditingEnabled(true);
        setCircleNameDraftText(props.circleName);
    }

    // cancels create circle mode and brings back the circle management state
    function cancelCreateCircleButton() {
        setCreateCircleModeEnabled(false);
        setCircleNameEditingEnabled(false);
        setCircleNameDraftText(props.circleName);
    }

    /*
    ------------- @michellesousaa
    creates a circle by saving the draft name as the global state in the header, however, this function will be modified once Michelle creates the home page. it should eventually push the new circle into the circles area on the home page. CSS has already been created for it in preparation. */
    function finishCreateCircleButton() {
        setCreateCircleModeEnabled(false);
        setCircleNameEditingEnabled(false);
        props.setCircleName(circleNameDraftText);
    }

    // sends an invite and adds the invited user into the members section. extra space at the end is trimmed off and prevents an empty submission. the member is given an ID to track who they are using date.now to create a unique one each time.
    function sendInviteButton() {
        const trimmedEmailText = addMember.trim();

        if (trimmedEmailText.length === 0) {
            return;
        }

        const newMemberObject = {
            memberId: "member-" + Date.now(),
            memberLabel: trimmedEmailText
        };

        // make a copy of the members so that only the copy is modified and pushed to to updated list. this will add a member to it
        const oldMembersList = circleMembersList;
        const newMembersList = oldMembersList.slice();
        newMembersList.push(newMemberObject);
        setCircleMembersList(newMembersList);

        setAddMember("");
    }

    // removes a member from the circle by rebuilding the list. member updates are put in an empty array
    function removeMemberButton(memberIdRemoval) {
        const oldMembersList = circleMembersList;
        const updatedMembersList = [];
        let indexNumber = 0;

        // while the index is less than the length of the old members list, if the current member object's ID is not the one being removed, then add it to the updated members list
        while (indexNumber < oldMembersList.length) {
            const currentMemberObject = oldMembersList[indexNumber];

            if (currentMemberObject.memberId !== memberIdRemoval) {
                updatedMembersList.push(currentMemberObject);
            }

            indexNumber = indexNumber + 1;
        }

        setCircleMembersList(updatedMembersList);
    }


    // if statements to adjust what's visible/enabled in the layout
    let pageCardTitleText = "Circle Management";
    if (createCircleModeEnabled === true) {
        pageCardTitleText = "Create A Circle";
    }

    let showCreateNewCircleButton = true;
    if (createCircleModeEnabled === true) {
        showCreateNewCircleButton = false;
    }

    let circleNameInputDisabled = true;
    if (circleNameEditingEnabled === true) {
        circleNameInputDisabled = false;
    }

    let showManageBottomButtons = true;
    let showCreateBottomButtons = false;

    if (createCircleModeEnabled === true) {
        showManageBottomButtons = false;
        showCreateBottomButtons = true;
    }

    let showEmptyMembersPlaceholder = false;
    if (circleMembersList.length === 0) {
        showEmptyMembersPlaceholder = true;
    }

    return (
        <div>
            <Header currentCircle={props.circleName} profileImage="#" activePage="managecircles" />
            <div className="manage-layout">
                <Navbar activePage="managecircles" />
                <main className='manage-main'>
                    <div className="manage-panel">
                        <div className="circle-card">
                            <div className="circle-card-header">
                                <h2 className="circle-title">{pageCardTitleText}</h2>
                                {showCreateNewCircleButton && (
                                    <button className="primary-btn" type="button" onClick={createNewCircleButton}>Create New Circle</button>
                                )}
                            </div>
                            <div className="circle-form">
                                <p className="field-label">Circle name</p>
                                <div className="circle-name-row">
                                    <input className="text-input" type="text" value={circleNameDraftText} onChange={circleNameDraftChange} disabled={circleNameInputDisabled} />
                                    <button className="icon-btn" type="button" onClick={editOrSaveButton}>
                                        {circleNameEditingEnabled === false && (
                                            <img className="circle-name-icon" src={editIconImagePath} alt="Edit circle name" />
                                        )}

                                        {circleNameEditingEnabled === true && (
                                            <span className="save-text">Save</span>
                                        )}
                                    </button>
                                </div>
                                <p className="field-label section-space">Add member</p>
                                <div className="invite-row">
                                    <input className="text-input" type="text" placeholder="Email" value={addMember} onChange={addMemberEmail} />
                                    <button className="primary-btn" type="button" onClick={sendInviteButton}>Send Invite</button>
                                </div>
                                <div className="members-header section-space">
                                    <p className="field-label">Manage members</p>
                                    <p className="member-count">({circleMembersList.length}/8)</p>
                                </div>
                                {showEmptyMembersPlaceholder && (
                                    <div className="members-empty"></div>
                                )}
                                {!showEmptyMembersPlaceholder && (
                                    <div className="members-grid">
                                        {circleMembersList.map(function (memberObject) {
                                            return (
                                                <div className="member-row" key={memberObject.memberId}>
                                                    <p className="member-name">{memberObject.memberLabel}</p>
                                                    <button className="member-remove" type="button" onClick={function () { removeMemberButton(memberObject.memberId); }}>Remove</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <div className="bottom-actions">
                                    {showManageBottomButtons && (
                                        <div className="bottom-actions-manage">
                                            <a className="leave-link" href="#leave">Leave Circle</a>
                                            <button className="primary-btn" type="button">Save Changes</button>
                                        </div>
                                    )}
                                    {showCreateBottomButtons && (
                                        <div className="bottom-actions-create">
                                            <button className="secondary-btn" type="button" onClick={cancelCreateCircleButton}>Cancel</button>
                                            <button className="primary-btn" type="button" onClick={finishCreateCircleButton}>Finish</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="invites-card">
                            <h3 className="invites-title">Circle Invitations</h3>
                            <div className="invites-empty"></div>
                        </div>
                    </div>
                </main>
                <ActivityFeed />
            </div>
        </div>
    );
}

export default ManageCircles
