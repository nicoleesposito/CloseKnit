import './ManageCircles.css'
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/LanguageContext';

function ManageCircles(props) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [circleNameEditingEnabled, setCircleNameEditingEnabled] = useState(false);
    const [circleNameDraftText, setCircleNameDraftText] = useState(props.circleName);
    const [createCircleModeEnabled, setCreateCircleModeEnabled] = useState(false);
    const [addMemberEmail, setAddMemberEmail] = useState("");
    const [circleMembersList, setCircleMembersList] = useState([]);
    const [memberError, setMemberError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [leaveSuccess, setLeaveSuccess] = useState(false);
    const [limitReached, setLimitReached] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [inviteSuccess, setInviteSuccess] = useState(false);
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

    // fetch pending invitations for the logged-in user
    useEffect(function () {
        async function fetchInvitations() {
            try {
                const response = await fetch('/api/circles/invitations', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setInvitations(data);
                }
            } catch {
                console.log('Failed to fetch invitations');
            }
        }
        fetchInvitations();
    }, []);

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

    // sends a circle invitation to the entered email
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
            const response = await fetch('/api/circles/' + props.activeCircleId + '/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (response.ok) {
                setAddMemberEmail("");
                setInviteSuccess(true);
                setTimeout(() => setInviteSuccess(false), 3000);
            } else {
                setMemberError(data.message);
            }
        } catch {
            setMemberError(t('manageCircles.failedToSendInvitation'));
        }
    }

    async function respondToInvitation(action) {
        if (!selectedInvitation) return;
        try {
            const response = await fetch('/api/circles/' + selectedInvitation.circleId + '/invitations/' + selectedInvitation.invitationId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ action })
            });

            if (response.ok) {
                setInvitations(function (prev) {
                    return prev.filter(function (inv) { return inv.invitationId !== selectedInvitation.invitationId; });
                });
                setSelectedInvitation(null);

                // if accepted, refresh circles so the new circle appears
                if (action === 'accept' && props.refreshCircles) {
                    props.refreshCircles();
                }
            }
        } catch {
            console.log('Failed to respond to invitation');
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

    let pageCardTitleText = t('manageCircles.circleManagement');
    if (createCircleModeEnabled === true) pageCardTitleText = t('manageCircles.createACircle');

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
                                    <button className="primary-btn" type="button" onClick={createNewCircleButton}>{t('manageCircles.createNewCircle')}</button>
                                )}
                            </div>
                            <div className="circle-form">
                                <p className="field-label">{t('manageCircles.circleName')}</p>
                                <div className="circle-name-row">
                                    <input className="text-input" type="text" value={circleNameDraftText} onChange={circleNameDraftChange} disabled={circleNameInputDisabled} />
                                    <button className="icon-btn" type="button" onClick={editOrSaveButton}>
                                        {circleNameEditingEnabled === false && (
                                            <img className="circle-name-icon" src={editIconImagePath} alt="Edit circle name" />
                                        )}
                                        {circleNameEditingEnabled === true && (
                                            <span className="save-text">{t('manageCircles.save')}</span>
                                        )}
                                    </button>
                                </div>
                                <p className="field-label section-space">{t('manageCircles.addMember')}</p>
                                <div className="invite-row">
                                    <input className="text-input" type="text" placeholder={t('manageCircles.emailPlaceholder')} value={addMemberEmail} onChange={addMemberEmailChange} />
                                    <button className="primary-btn" type="button" onClick={addMemberClick}>{t('manageCircles.invite')}</button>
                                </div>
                                {memberError.length > 0 && (
                                    <p className="member-error">{memberError}</p>
                                )}
                                <div className="members-header section-space">
                                    <p className="field-label">{t('manageCircles.manageMembers')}</p>
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
                                                        <button className="member-remove" type="button" onClick={function () { removeMemberButton(memberUserId); }}>{t('manageCircles.remove')}</button>
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
                                                <button className="leave-btn" type="button" onClick={leaveCircleButton}>{t('manageCircles.leaveCircle')}</button>
                                            )}
                                            {circleNameEditingEnabled && (
                                                <button className="primary-btn" type="button" onClick={saveChangesButton}>{t('manageCircles.saveChanges')}</button>
                                            )}
                                        </div>
                                    )}
                                    {showCreateBottomButtons && (
                                        <div className="bottom-actions-create">
                                            <button className="secondary-btn" type="button" onClick={cancelCreateCircleButton}>{t('manageCircles.cancel')}</button>
                                            <button className="primary-btn" type="button" onClick={finishCreateCircleButton}>{t('manageCircles.finish')}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {saveSuccess && (
                            <div className="save-toast">{t('manageCircles.changesSaved')}</div>
                        )}
                        {inviteSuccess && (
                            <div className="save-toast">{t('manageCircles.invitationSent')}</div>
                        )}
                        {leaveSuccess && (
                            <div className="leave-toast">{t('manageCircles.youLeft').replace('{name}', props.circleName)}</div>
                        )}
                        {limitReached && (
                            <div className="save-toast">
                                {t('manageCircles.circleLimit')}
                            </div>
                        )}
                        <div className="invites-card">
                            <h3 className="invites-title">{t('manageCircles.circleInvitations')}</h3>
                            {invitations.length === 0 && (
                                <p className="invites-empty-text">{t('manageCircles.noPendingInvitations')}</p>
                            )}
                            {invitations.length > 0 && (
                                <div className="invites-row">
                                    {invitations.map(function (inv) {
                                        return (
                                            <button
                                                key={inv.invitationId}
                                                className="invite-card-btn"
                                                type="button"
                                                onClick={function () { setSelectedInvitation(inv); }}
                                            >
                                                {inv.circleName}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {selectedInvitation && (
                            <div className="inv-modal-overlay" onClick={function () { setSelectedInvitation(null); }}>
                                <div className="inv-modal" onClick={function (e) { e.stopPropagation(); }}>
                                    <p className="inv-modal-title">{t('manageCircles.youGotInvited').replace('{name}', selectedInvitation.circleName)}</p>
                                    <p className="inv-modal-subtitle">{t('manageCircles.youWereInvitedBy').replace('{name}', selectedInvitation.invitedBy)}</p>
                                    <div className="inv-modal-buttons">
                                        <button className="secondary-btn" type="button" onClick={function () { setSelectedInvitation(null); }}>{t('manageCircles.close')}</button>
                                        <button className="primary-btn" type="button" onClick={function () { respondToInvitation('accept'); }}>{t('manageCircles.acceptInvite')}</button>
                                        <button className="inv-decline-btn" type="button" onClick={function () { respondToInvitation('decline'); }}>{t('manageCircles.declineInvite')}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <ActivityFeed activeCircleId={props.activeCircleId} />
            </div>
        </div>
    );
}

export default ManageCircles