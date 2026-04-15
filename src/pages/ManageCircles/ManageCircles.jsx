import './ManageCircles.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/useAuth';

function ManageCircles(props) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [circleNameEditingEnabled, setCircleNameEditingEnabled] = useState(false);
    const [circleNameDraftText, setCircleNameDraftText] = useState(props.circleName);
    const [createCircleModeEnabled, setCreateCircleModeEnabled] = useState(false);
    const [addMemberEmail, setAddMemberEmail] = useState("");
    const [circleMembersList, setCircleMembersList] = useState([]);
    const [memberError, setMemberError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [leaveSuccess, setLeaveSuccess] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const editIconImagePath = "/images/ui/edit-button-purple.svg";

    // find the active circle to check if the current user is the owner
    const activeCircle = props.circles.find(function (c) { return c._id === props.activeCircleId; });
    const isOwner = activeCircle && user && activeCircle.owner === user._id;

    // fetch the member list whenever the active circle changes fromthe db
    useEffect(function () {
        if (!props.activeCircleId) {
            setCircleMembersList([]);
            return;
        }

        async function fetchMembers() {
            try {
                const response = await fetch('/api/circles/' + props.activeCircleId + '/members', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setCircleMembersList(data);
                }
            } catch {
                console.log('Failed to fetch members');
            }
        }

        fetchMembers();
    }, [props.activeCircleId]);

    function circleNameDraftChange(changeEvent) {
        setCircleNameDraftText(changeEvent.target.value);
    }

    function addMemberEmailChange(changeEvent) {
        setAddMemberEmail(changeEvent.target.value);
        setMemberError("");
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

    // looks up the email in the database and adds them to the circle if found
    async function addMemberClick() {
        const email = addMemberEmail.trim();

        if (email.length === 0) {
            return;
        }

        if (!props.activeCircleId) {
            return;
        }

        setMemberError("");

        try {
            const response = await fetch('/api/circles/' + props.activeCircleId + '/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (response.ok) {
                setCircleMembersList(data);
                setAddMemberEmail("");
            } else {
                setMemberError(data.message);
            }
        } catch {
            setMemberError('Failed to add member');
        }
    }

    // removes a member from the circle, only works if the current user is the owner
    async function removeMemberButton(memberUserId) {
        try {
            const response = await fetch('/api/circles/' + props.activeCircleId + '/members/' + memberUserId, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setCircleMembersList(data);
            }
        } catch {
            console.log('Failed to remove member');
        }
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
                                    <input className="text-input" type="text" placeholder="Email" value={addMemberEmail} onChange={addMemberEmailChange} />
                                    <button className="primary-btn" type="button" onClick={addMemberClick}>Add</button>
                                </div>
                                {memberError.length > 0 && (
                                    <p className="member-error">{memberError}</p>
                                )}
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
                                            const memberName = memberObject.user.firstName + ' ' + memberObject.user.lastName;
                                            const memberUserId = memberObject.user._id;
                                            const canRemove = isOwner && memberUserId !== user._id;

                                            return (
                                                <div className="member-row" key={memberObject._id}>
                                                    <p className="member-name">{memberName}</p>
                                                    {canRemove && (
                                                        <button className="member-remove" type="button" onClick={function () { removeMemberButton(memberUserId); }}>Remove</button>
                                                    )}
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
                <ActivityFeed activeCircleId={props.activeCircleId} />
            </div>
        </div>
    );
}

export default ManageCircles