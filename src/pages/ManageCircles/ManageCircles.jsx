import './ManageCircles.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageCircles(props) {
    const navigate = useNavigate();
    const [circleNameEditingEnabled, setCircleNameEditingEnabled] = useState(false);
    const [circleNameDraftText, setCircleNameDraftText] = useState(props.circleName);
    const [createCircleModeEnabled, setCreateCircleModeEnabled] = useState(false);
    const [addMember, setAddMember] = useState("");
    const [circleMembersList, setCircleMembersList] = useState([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [leaveSuccess, setLeaveSuccess] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const editIconImagePath = "/images/ui/edit-button-purple.svg";

    function circleNameDraftChange(changeEvent) {
        setCircleNameDraftText(changeEvent.target.value);
    }

    function addMemberEmail(changeEvent) {
        setAddMember(changeEvent.target.value);
    }

    function editOrSaveButton() {
    if (circleNameEditingEnabled === false) {
        setCircleNameEditingEnabled(true);
        if (!createCircleModeEnabled) {
            setCircleNameDraftText(props.circleName);
        }
        return;
    }
    if (!createCircleModeEnabled) {
        props.updateCircleName(circleNameDraftText);
    }
    setCircleNameEditingEnabled(false);
}

    function createNewCircleButton() {
    if (props.circles.length >= 5) {
        setLimitReached(true);
        setTimeout(() => setLimitReached(false), 3000);
        return;
    }
    setCreateCircleModeEnabled(true);
    setCircleNameEditingEnabled(true);
    setCircleNameDraftText("");
}

    function cancelCreateCircleButton() {
        setCreateCircleModeEnabled(false);
        setCircleNameEditingEnabled(false);
        setCircleNameDraftText(props.circleName);
    }

    function finishCreateCircleButton() {
    const nameToCreate = circleNameDraftText.trim();
    setCreateCircleModeEnabled(false);
    setCircleNameEditingEnabled(false);
    setCircleNameDraftText("");
    if (nameToCreate.length > 0) {
        props.addCircle(nameToCreate);
    }
}

    function saveChangesButton() {
        if (circleNameDraftText && circleNameDraftText.trim().length > 0) {
            props.updateCircleName(circleNameDraftText.trim());
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    }

    function leaveCircleButton() {
    setLeaveSuccess(true);
    const remainingCircles = props.circles.filter(c => c._id !== props.activeCircleId);
    setTimeout(async () => {
        await props.removeCircle(props.activeCircleId);
        setLeaveSuccess(false);
        if (remainingCircles.length === 0) {
            navigate('/newhome');
        } else {
            navigate('/home');
        }
    }, 2000);
}

    function copyInviteLink() {
        const inviteText = `Join my circle "${props.circleName}" on CloseKnit!`;
        navigator.clipboard.writeText(inviteText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
        });
    }

    function removeMemberButton(memberIdRemoval) {
        const updatedMembersList = circleMembersList.filter(
            member => member.memberId !== memberIdRemoval
        );
        setCircleMembersList(updatedMembersList);
    }

    let pageCardTitleText = "Circle Management";
    if (createCircleModeEnabled === true) pageCardTitleText = "Create A Circle";

    let showCreateNewCircleButton = true;
    if (createCircleModeEnabled === true) showCreateNewCircleButton = false;

    let circleNameInputDisabled = true;
    if (circleNameEditingEnabled === true) circleNameInputDisabled = false;

    let showManageBottomButtons = true;
    let showCreateBottomButtons = false;
    if (createCircleModeEnabled === true) {
        showManageBottomButtons = false;
        showCreateBottomButtons = true;
    }

    let showEmptyMembersPlaceholder = false;
    if (circleMembersList.length === 0) showEmptyMembersPlaceholder = true;

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
                                <button className="primary-btn" type="button" onClick={copyInviteLink}>Copy Link</button>
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
                                            {props.activeCircleId && props.circleName && props.circleName.trim().length > 0 && (
                                                <button className="leave-btn" type="button" onClick={leaveCircleButton}>Leave Circle</button>
                                            )}
                                            {circleNameEditingEnabled && (
                                                <button className="primary-btn" type="button" onClick={saveChangesButton}>Save Changes</button>
                                            )}
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
                        {saveSuccess && (
                            <div className="save-toast">✓ Changes saved!</div>
                        )}
                        {leaveSuccess && (
                            <div className="leave-toast">You left "{props.circleName}"!</div>
                        )}
                        {copySuccess && (
                            <div className="save-toast">✓ Invite link copied to clipboard!</div>
                        )}
                        {limitReached && (
                        <div className="save-toast">
                        ⚠️ Your limit is 5 circles!
                        </div>
                        )}
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