import './Journal.css'
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';
import HelpButton from '../../components/HelpButton/HelpButton';
import { useLanguage } from '../../context/LanguageContext';

/*
useEffect docs: https://react.dev/reference/react/useEffect
Jeremy McPeak CH.12 of Javascript Book
*/

function Journal(props) {
    const { t } = useLanguage();
    const [currentJournalScreen, setCurrentJournalScreen] = useState("list");
    const [journalEntries, setJournalEntries] = useState([]);
    const [activeEntryId, setActiveEntryId] = useState(null);
    const [searchText, setSearchText] = useState("");

    // create and edit form fields states
    const [entryTitleText, setEntryTitleText] = useState("");
    const [entryDescriptionText, setEntryDescriptionText] = useState("");
    const [entryBodyText, setEntryBodyText] = useState("");

    // toolbar styling states
    const [selectedFontName, setSelectedFontName] = useState("Poppins");
    const [selectedTextAlign, setSelectedTextAlign] = useState("left");
    const [isBoldActive, setBoldActive] = useState(false);
    const [isItalicActive, setItalicActive] = useState(false);
    const [isUnderlineActive, setUnderlineActive] = useState(false);

    const [suggestedEntriesOpen, setSuggestedEntriesOpen] = useState(true);

    // states for the comment box, whether its open or not and the text it holds
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [commentInputText, setCommentInputText] = useState("");

    // delete entry
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [deleteEntryId, setDeleteEntryId] = useState(null);

    // fetch journal entries from the backend whenever the active circle changes
    useEffect(function () {
        if (!props.activeCircleId) {
            setJournalEntries([]);
            return;
        }

        async function fetchEntries() {
            try {
                const response = await fetch('/api/circles/' + props.activeCircleId + '/journal', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setJournalEntries(data);
                }
            } catch {
                console.log('Failed to fetch journal entries');
            }
        }

        fetchEntries();
    }, [props.activeCircleId]);

    // returns the full name of an entry's author
    function getAuthorName(entry) {
        if (entry.author && entry.author.firstName) {
            return entry.author.firstName + ' ' + entry.author.lastName;
        }
        return t('journal.unknown');
    }

    // returns the full name of a comment's author
    function getCommentAuthorName(comment) {
        if (comment.author && comment.author.firstName) {
            return comment.author.firstName + ' ' + comment.author.lastName;
        }
        return t('journal.unknown');
    }

    // loops through the journal entries and returns the object with the matching id
    function findEntryById(entryId) {
        let foundEntry = null;

        let index = 0;
        while (index < journalEntries.length) {
            const currentEntry = journalEntries[index];

            if (currentEntry._id === entryId) {
                foundEntry = currentEntry;
            }

            index = index + 1;
        }

        return foundEntry;
    }

    // calculates how many days ago the entry was created and returns the matching label
    function getDaysAgoText(dateString) {
        const nowTimeNumber = Date.now();
        const entryTimeNumber = new Date(dateString).getTime();
        const differenceNumber = nowTimeNumber - entryTimeNumber;
        const oneDayNumber = 24 * 60 * 60 * 1000;
        const dayCount = Math.floor(differenceNumber / oneDayNumber);

        if (dayCount <= 0) {
            return t('journal.today');
        }

        if (dayCount === 1) {
            return t('journal.oneDayAgo');
        }

        return t('journal.daysAgo').replace('{n}', dayCount);
    }

    // filters the text entries by trimming extra space and turning it into lowercase for standard text.
    // if the search is empty then just show the journal entries, but when the index is greater than 0 in length
    // the while loop iterates through the entries and checks if it matches. matching entries are added into the empty array
    function getFilteredEntries() {
        const trimmedSearchText = searchText.trim().toLowerCase();

        if (trimmedSearchText.length === 0) {
            return journalEntries;
        }

        const filteredList = [];

        let index = 0;

        while (index < journalEntries.length) {
            const currentEntry = journalEntries[index];
            const titleLower = currentEntry.titleText.toLowerCase();
            const descriptionLower = currentEntry.shortDescriptionText.toLowerCase();
            const matchesTitle = titleLower.includes(trimmedSearchText);
            const matchesDescription = descriptionLower.includes(trimmedSearchText);

            if (!matchesTitle && !matchesDescription) {
                index = index + 1;
                continue;
            }

            filteredList.push(currentEntry);

            index = index + 1;
        }

        return filteredList;
    }

    function clearEditorForm() {
        setEntryTitleText("");
        setEntryDescriptionText("");
        setEntryBodyText("");
        setSelectedFontName("Poppins");
        setSelectedTextAlign("left");
        setBoldActive(false);
        setItalicActive(false);
        setUnderlineActive(false);
        setSuggestedEntriesOpen(true);
    }

    // checks if anything is empty to prevent saving empty strings
    function entryIsEmpty() {
        const trimmedTitle = entryTitleText.trim();
        const trimmedDescription = entryDescriptionText.trim();
        const trimmedBody = entryBodyText.trim();

        if (trimmedTitle.length === 0 && trimmedDescription.length === 0 && trimmedBody.length === 0) {
            return true;
        }

        return false;
    }

    // builds the text style object as an object with the features being passed through from the if statements.
    // this only shows while edit mode is on
    function getEditorStyleObject() {
        const styleObject = {
            fontFamily: selectedFontName,
            textAlign: selectedTextAlign,
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
        };

        if (isBoldActive) {
            styleObject.fontWeight = "700";
        }

        if (isItalicActive) {
            styleObject.fontStyle = "italic";
        }

        if (isUnderlineActive) {
            styleObject.textDecoration = "underline";
        }

        return styleObject;
    }

    // similar to last function, but is activated only when an entry (which is submitted as an object) is viewed to show the styling of it
    function viewStyle(entryObject) {
        const styleObject = {
            fontFamily: entryObject.fontName,
            textAlign: entryObject.textAlign,
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
            whiteSpace: "pre-wrap",
            lineHeight: "1.6",
            fontSize: "16px",
        };

        if (entryObject.isBold) {
            styleObject.fontWeight = "700";
        }

        if (entryObject.isItalic) {
            styleObject.fontStyle = "italic";
        }

        if (entryObject.isUnderline) {
            styleObject.textDecoration = "underline";
        }

        return styleObject;
    }

    // returns the comments for the entry currently being viewed
    // comments come from the entry object itself since the backend returns them nested inside the entry
    function getCommentsForActiveEntry() {
        if (activeEntryId === null) {
            return [];
        }

        const entry = findEntryById(activeEntryId);

        if (!entry) {
            return [];
        }

        return entry.comments;
    }

    // the following functions read the current input's value and update the state
    function searchTextChange(changeEvent) {
        const inputValue = changeEvent.currentTarget.value;
        setSearchText(inputValue);
    }

    function titleTextChange(changeEvent) {
        const inputValue = changeEvent.currentTarget.value;
        setEntryTitleText(inputValue);
    }

    function descriptionChange(changeEvent) {
        const inputValue = changeEvent.currentTarget.value;
        setEntryDescriptionText(inputValue);
    }

    function bodyTextChange(changeEvent) {
        const inputValue = changeEvent.currentTarget.value;
        setEntryBodyText(inputValue);
    }

    function commentInputChange(changeEvent) {
        const inputValue = changeEvent.currentTarget.value;
        setCommentInputText(inputValue);
    }

    function suggestedToggle() {
        const newValue = !suggestedEntriesOpen;
        setSuggestedEntriesOpen(newValue);
    }

    // function for the suggested entry cubes that user can toggle
    function chooseSuggestedTemplate(templateName) {
        setSuggestedEntriesOpen(false);

        if (templateName === "travel") {
            setEntryTitleText(t('journal.travelTitle'));
            setEntryDescriptionText(t('journal.travelText'));
            setEntryBodyText(t('journal.travelBody'));
        }

        if (templateName === "happy") {
            setEntryTitleText(t('journal.happyTitle'));
            setEntryDescriptionText(t('journal.happyText'));
            setEntryBodyText(t('journal.happyBody'));
        }

        if (templateName === "growth") {
            setEntryTitleText(t('journal.growthTitle'));
            setEntryDescriptionText(t('journal.growthText'));
            setEntryBodyText(t('journal.growthBody'));
        }
    }

    function handleTravelTemplateClick() {
        chooseSuggestedTemplate("travel");
    }

    function handleHappyTemplateClick() {
        chooseSuggestedTemplate("happy");
    }

    function handleGrowthTemplateClick() {
        chooseSuggestedTemplate("growth");
    }

    // these functions handle the toolbar settings in the editor
    function boldClick() {
        const newValue = !isBoldActive;
        setBoldActive(newValue);
    }

    function italicClick() {
        const newValue = !isItalicActive;
        setItalicActive(newValue);
    }

    function underlineClick() {
        const newValue = !isUnderlineActive;
        setUnderlineActive(newValue);
    }

    function alignLeftClick() {
        setSelectedTextAlign("left");
    }

    function alignCenterClick() {
        setSelectedTextAlign("center");
    }

    function alignRightClick() {
        setSelectedTextAlign("right");
    }

    function handleFontChange(changeEvent) {
        const selectedValue = changeEvent.currentTarget.value;
        setSelectedFontName(selectedValue);
    }

    // these functions change the view/state of the screen
    function newEntryClick() {
        clearEditorForm();
        setActiveEntryId(null);
        setCommentsOpen(false);
        setCurrentJournalScreen("create");
    }

    function openEntryInViewMode(entryId) {
        setActiveEntryId(entryId);
        setCommentsOpen(false);
        setCurrentJournalScreen("view");
    }

    function createOpenEntryClick(entryId) {
        function inputClick() {
            openEntryInViewMode(entryId);
        }
        return inputClick;
    }

    function openEntryInEditMode(entryId) {
        const entryToEdit = findEntryById(entryId);

        if (entryToEdit) {
            setActiveEntryId(entryToEdit._id);
            setEntryTitleText(entryToEdit.titleText);
            setEntryDescriptionText(entryToEdit.shortDescriptionText);
            setEntryBodyText(entryToEdit.bodyText);
            setSelectedFontName(entryToEdit.fontName);
            setSelectedTextAlign(entryToEdit.textAlign);
            setBoldActive(entryToEdit.isBold);
            setItalicActive(entryToEdit.isItalic);
            setUnderlineActive(entryToEdit.isUnderline);
            setSuggestedEntriesOpen(false);
            setCommentsOpen(false);
            setCurrentJournalScreen("create");
        }
    }

    function editButtonClick() {
        openEntryInEditMode(activeEntryId);
    }

    function backArrowFromView() {
        setCommentsOpen(false);
        setCurrentJournalScreen("list");
    }

    // sends a new entry to the backend and adds it to the top of the list in state.
    // returns the created entry on success, or null if it failed.
    async function saveNewEntry() {
        const circleId = props.activeCircleId;

        const entryData = {
            titleText: entryTitleText,
            shortDescriptionText: entryDescriptionText,
            bodyText: entryBodyText,
            fontName: selectedFontName,
            textAlign: selectedTextAlign,
            isBold: isBoldActive,
            isItalic: isItalicActive,
            isUnderline: isUnderlineActive
        };

        try {
            const response = await fetch('/api/circles/' + circleId + '/journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(entryData)
            });

            if (response.ok) {
                const createdEntry = await response.json();
                // put the new entry at the top of the list
                const updatedEntries = journalEntries.slice();
                updatedEntries.unshift(createdEntry);
                setJournalEntries(updatedEntries);
                return createdEntry;
            }
        } catch {
            console.log('Failed to save journal entry');
        }

        return null;
    }

    // sends the updated entry to the backend and replaces the old version in state.
    // returns the updated entry on success, or null if it failed.
    async function updateEntryInApi(entryId) {
        const circleId = props.activeCircleId;

        const entryData = {
            titleText: entryTitleText,
            shortDescriptionText: entryDescriptionText,
            bodyText: entryBodyText,
            fontName: selectedFontName,
            textAlign: selectedTextAlign,
            isBold: isBoldActive,
            isItalic: isItalicActive,
            isUnderline: isUnderlineActive
        };

        try {
            const response = await fetch('/api/circles/' + circleId + '/journal/' + entryId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(entryData)
            });

            if (response.ok) {
                const updatedEntry = await response.json();
                // replace the old version of this entry in the list
                const updatedEntries = [];
                let index = 0;
                while (index < journalEntries.length) {
                    const currentEntry = journalEntries[index];
                    if (currentEntry._id === entryId) {
                        updatedEntries.push(updatedEntry);
                    } else {
                        updatedEntries.push(currentEntry);
                    }
                    index = index + 1;
                }
                setJournalEntries(updatedEntries);
                return updatedEntry;
            }
        } catch {
            console.log('Failed to update journal entry');
        }

        return null;
    }

    // if the user didn't type anything then do nothing. if activeEntryId is null we are creating a new entry.
    // only switches to view screen if the save actually succeeded.
    async function saveButtonClick() {
        if (entryIsEmpty()) {
            return;
        }

        let savedEntry = null;

        if (activeEntryId === null) {
            savedEntry = await saveNewEntry();
        } else {
            savedEntry = await updateEntryInApi(activeEntryId);
        }

        if (savedEntry === null) {
            return;
        }

        setActiveEntryId(savedEntry._id);
        setCommentsOpen(false);
        setCurrentJournalScreen("view");
    }

    // if the user wants to go back to the main entry page, pressing the back arrow will save and take them there
    async function backArrowFromCreate() {
        if (entryIsEmpty()) {
            setCurrentJournalScreen("list");
            return;
        }

        let savedEntry = null;

        if (activeEntryId === null) {
            savedEntry = await saveNewEntry();
        } else {
            savedEntry = await updateEntryInApi(activeEntryId);
        }

        if (savedEntry !== null) {
            setActiveEntryId(savedEntry._id);
        }

        setCommentsOpen(false);
        setCurrentJournalScreen("list");
    }

    // controls the opening and closing of the comments section
    function commentsToggleClick() {
        const newValue = !commentsOpen;
        setCommentsOpen(newValue);
    }

    function commentsTextArrow() {
        if (commentsOpen) {
            return <img src='/images/ui/dropdown-arrow.svg' />;
        }
        return <img src='/images/ui/dropdown-arrow-open.svg' />;
    }

    function suggestedTextArrow() {
        if (suggestedEntriesOpen) {
            return <img src='/images/ui/dropdown-arrow.svg' />;
        }
        return <img src='/images/ui/dropdown-arrow-open.svg' />;
    }

    // sends a new comment to the backend and updates the entry in state with the returned version
    async function addCommentClick() {
        const trimmedComment = commentInputText.trim();

        if (trimmedComment.length === 0) {
            return;
        }

        if (activeEntryId === null) {
            return;
        }

        const circleId = props.activeCircleId;

        try {
            const response = await fetch('/api/circles/' + circleId + '/journal/' + activeEntryId + '/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ text: trimmedComment })
            });

            if (response.ok) {
                const updatedEntry = await response.json();
                // replace the entry in the list with the updated version which now has the new comment
                const updatedEntries = [];
                let index = 0;
                while (index < journalEntries.length) {
                    const currentEntry = journalEntries[index];
                    if (currentEntry._id === activeEntryId) {
                        updatedEntries.push(updatedEntry);
                    } else {
                        updatedEntries.push(currentEntry);
                    }
                    index = index + 1;
                }
                setJournalEntries(updatedEntries);
                setCommentInputText("");
            }
        } catch {
            console.log('Failed to post comment');
        }
    }

    // functions made for the pop up box to delete an entry
    function openDeletePopup(entryId) {
        setDeleteEntryId(entryId);
        setDeletePopupOpen(true);
    }

    function closeDeletePopup() {
        setDeletePopupOpen(false);
        setDeleteEntryId(null);
    }

    // sends a delete request to the backend and rebuilds the list without the deleted entry
    async function deleteEntryFromApi(entryId) {
        const circleId = props.activeCircleId;

        try {
            const response = await fetch('/api/circles/' + circleId + '/journal/' + entryId, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                // rebuild the list skipping the deleted entry
                const updatedEntries = [];
                let index = 0;
                while (index < journalEntries.length) {
                    const currentEntry = journalEntries[index];
                    if (currentEntry._id !== entryId) {
                        updatedEntries.push(currentEntry);
                    }
                    index = index + 1;
                }
                setJournalEntries(updatedEntries);

                if (activeEntryId === entryId) {
                    setActiveEntryId(null);
                    setCurrentJournalScreen("list");
                }
            }
        } catch {
            console.log('Failed to delete journal entry');
        }
    }

    async function confirmDeleteClick() {
        if (deleteEntryId === null) {
            closeDeletePopup();
            return;
        }

        await deleteEntryFromApi(deleteEntryId);
        closeDeletePopup();
    }

    // prevent default stops browser, stop propagation stops the processes from running in chain.
    // this is because there is a button inside a button and was the only solution without restructuring everything
    function createOpenDeletePopup(entryId) {
        function inputClick(clickEvent) {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            openDeletePopup(entryId);
        }
        return inputClick;
    }

    // shows the delete pop up when pressed
    function buildDeletePopup() {
        if (deletePopupOpen === false) {
            return null;
        }

        return (
            <div className="journal-modal-overlay">
                <div className="journal-modal-card">
                    <div className="journal-modal-icon-wrap">
                        <img className="journal-modal-icon" src="/images/ui/trash.svg" alt="" />
                    </div>
                    <h2 className="journal-modal-title">{t('journal.confirmDeletion')}</h2>
                    <p className="journal-modal-text">{t('journal.deleteConfirmText')}</p>
                    <p className="journal-modal-subtext">{t('journal.cannotUndo')}</p>
                    <div className="journal-modal-buttons">
                        <button className="journal-modal-cancel" onClick={closeDeletePopup} type="button">{t('journal.cancel')}</button>
                        <button className="journal-modal-delete" onClick={confirmDeleteClick} type="button">{t('journal.delete')}</button>
                    </div>
                </div>
            </div>
        );
    }

    function buildListScreenContent() {
        const filteredEntries = getFilteredEntries();

        if (filteredEntries.length === 0) {
            return (
                <main className='manage-main'>
                    <div className="journal-panel journal-panel-relative">
                        <div className="journal-list-top-row">
                            <HelpButton page="journal" />
                            <input className="journal-search-input" placeholder={t('journal.searchPlaceholder')} value={searchText} onChange={searchTextChange} type="text" />
                            <button className="journal-new-entry-button" onClick={newEntryClick} type="button">
                                <span className="journal-new-entry-icon"><img src="/images/ui/add-entry-white.svg" alt="" /></span>
                                <span>{t('journal.newEntry')}</span>
                            </button>
                        </div>
                        <img className="journal-gray-arrow" src="/images/ui/gray-arrow.svg" alt="" />
                        <div className="journal-empty-state">
                            <p className="journal-empty-title">{t('journal.noEntriesYet')}</p>
                            <p className="journal-empty-subtitle">{t('journal.createFirstEntry')}</p>
                        </div>
                        {buildDeletePopup()}
                    </div>
                </main>
            );
        }

        return (
            <main className='manage-main'>
                <div className="journal-panel">
                    <div className="journal-list-top-row">
                        <HelpButton page="journal" />
                        <input className="journal-search-input" placeholder={t('journal.searchPlaceholder')} value={searchText} onChange={searchTextChange} type="text" />
                        <button className="journal-new-entry-button" onClick={newEntryClick} type="button">
                            <span className="journal-new-entry-icon"><img src="/images/ui/add-entry-white.svg" alt="" /></span>
                            <span>{t('journal.newEntry')}</span>
                        </button>
                    </div>
                    <h2 className="journal-entries-heading">{t('journal.ourEntries')}</h2>
                    <div className="journal-entries-grid">
                        {filteredEntries.map(function (entryObject) {
                            return (
                                <button key={entryObject._id} className="journal-entry-card" onClick={createOpenEntryClick(entryObject._id)} type="button" >
                                    <div className="journal-card-top-row">
                                        <h3 className="journal-card-title">{entryObject.titleText}</h3>
                                        <button className="journal-card-menu-button" onClick={createOpenDeletePopup(entryObject._id)} type="button">
                                            <span className="journal-card-menu">•••</span>
                                        </button>
                                    </div>
                                    <p className="journal-card-description">{entryObject.shortDescriptionText}</p>
                                    <div className="journal-card-bottom-row">
                                        <div className="journal-card-author">
                                            <span className="journal-card-avatar"><img src={entryObject.author?.profilePicture || "/images/ui/user-pfp.svg"} /></span>
                                            <span>{getAuthorName(entryObject)}</span>
                                        </div>
                                        <span className="journal-card-date">
                                            {getDaysAgoText(entryObject.createdAt)}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {buildDeletePopup()}
                </div>
            </main>
        );
    }

    function buildCreateScreenContent() {
        const editorToolBar = getEditorStyleObject();

        return (
            <main className='manage-main'>
                <div className="journal-panel">
                    <div className="journal-top-row">
                        <button className="journal-back-button" onClick={backArrowFromCreate} type="button">
                            <img className="journal-back-icon" src="/images/ui/back-arrow.svg" alt="Back" />
                        </button>
                    </div>
                    <input className="journal-title-input" value={entryTitleText} onChange={titleTextChange} placeholder={t('journal.titlePlaceholder')} type="text" />
                    <div className="journal-suggested-header">
                        <button className="journal-suggested-toggle" onClick={suggestedToggle} type="button">
                            <span>{t('journal.suggestedEntries')}</span>
                            <span className="journal-suggested-arrow">{suggestedTextArrow()}</span>
                        </button>
                    </div>
                    {suggestedEntriesOpen && (
                        <div className="journal-suggested-cards">
                            <button className="journal-suggested-card" onClick={handleTravelTemplateClick} type="button">
                                <p className="journal-suggested-title">{t('journal.travelTitle')}</p>
                                <p className="journal-suggested-text">{t('journal.travelText')}</p>
                            </button>
                            <button className="journal-suggested-card" onClick={handleHappyTemplateClick} type="button">
                                <p className="journal-suggested-title">{t('journal.happyTitle')}</p>
                                <p className="journal-suggested-text">{t('journal.happyText')}</p>
                            </button>
                            <button className="journal-suggested-card" onClick={handleGrowthTemplateClick} type="button">
                                <p className="journal-suggested-title">{t('journal.growthTitle')}</p>
                                <p className="journal-suggested-text">{t('journal.growthText')}</p>
                            </button>
                        </div>
                    )}
                    <input className="journal-description-input" value={entryDescriptionText} onChange={descriptionChange} placeholder={t('journal.descriptionPlaceholder')} type="text" />
                    <div className="journal-toolbar">
                        <button className="journal-tool-button" onClick={boldClick} type="button"><b>B</b></button>
                        <button className="journal-tool-button" onClick={italicClick} type="button"><i>I</i></button>
                        <button className="journal-tool-button" onClick={underlineClick} type="button"><u>U</u></button>
                        <div className="journal-toolbar-divider"></div>
                        <select className="journal-font-dropdown" value={selectedFontName} onChange={handleFontChange}>
                            <option value="Poppins">Poppins</option>
                            <option value="Arial">Arial</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                        <div className="journal-toolbar-divider"></div>
                        <button className="journal-tool-button" onClick={alignLeftClick} type="button">
                            <img className="journal-align-icon" src="/images/ui/textalign-left.svg" alt="Align Left" />
                        </button>
                        <button className="journal-tool-button" onClick={alignCenterClick} type="button">
                            <img className="journal-align-icon" src="/images/ui/textalign-center.svg" alt="Align Center" />
                        </button>
                        <button className="journal-tool-button" onClick={alignRightClick} type="button">
                            <img className="journal-align-icon" src="/images/ui/textalign-right.svg" alt="Align Right" />
                        </button>
                    </div>
                    <div className="journal-editor-area">
                        <textarea className="journal-textarea" placeholder={t('journal.bodyPlaceholder')} value={entryBodyText} onChange={bodyTextChange} style={editorToolBar}></textarea>
                    </div>
                    <div className="journal-save-row">
                        <button className="journal-save-button" onClick={saveButtonClick} type="button">{t('journal.save')}</button>
                    </div>
                    {buildDeletePopup()}
                </div>
            </main>
        );
    }

    // adds class name to comments section when opened
    function commentsPanelClassName() {
        if (commentsOpen) {
            return "journal-comments-panel journal-comments-panel-open";
        }
        return "journal-comments-panel";
    }

    function buildComments() {
        const commentList = getCommentsForActiveEntry();

        if (commentList.length === 0) {
            return (
                <div className="journal-comments-empty">
                    <p>{t('journal.noComments')}</p>
                    <p>{t('journal.writeFirstComment')}</p>
                </div>
            );
        }

        // object is mapped out with .map to repeat the rendering of submitted comments
        return (
            <div className="journal-comments-list">
                {commentList.map(function (commentObject) {
                    return (
                        <div key={commentObject._id} className="journal-comment">
                            <img
                                className="journal-comment-avatar"
                                src={commentObject.author?.profilePicture || "/images/ui/user-pfp.svg"}
                                alt=""
                            />
                            <div className="journal-comment-content">
                                <p className="journal-comment-author">{getCommentAuthorName(commentObject)}</p>
                                <p className="journal-comment-text">{commentObject.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    function buildViewScreenContent() {
        const activeEntry = findEntryById(activeEntryId);

        if (activeEntry === null) {
            return (
                <main className='manage-main'>
                    <div className="journal-panel">
                        <div className="journal-top-row">
                            <button className="journal-back-button" onClick={backArrowFromView} type="button">
                                <img className="journal-back-icon" src="/images/ui/back-arrow.svg" alt="Back" />
                            </button>
                        </div>
                        <p>{t('journal.entryNotFound')}</p>
                        {buildDeletePopup()}
                    </div>
                </main>
            );
        }

        const viewStyleObject = viewStyle(activeEntry);

        return (
            <main className='manage-main'>
                <div className="journal-panel journal-panel-with-comments">
                    <div className="journal-top-row">
                        <button className="journal-back-button" onClick={backArrowFromView} type="button">
                            <img className="journal-back-icon" src="/images/ui/back-arrow.svg" alt="Back" />
                        </button>
                        <button className="journal-edit-button" onClick={editButtonClick} type="button">
                            <span className="journal-edit-icon">✎</span>
                            <span>{t('journal.edit')}</span>
                        </button>
                    </div>
                    <h1 className="journal-view-title">{activeEntry.titleText}</h1>
                    <p className="journal-view-prompt">{activeEntry.shortDescriptionText}</p>
                    <div className="journal-divider"></div>
                    <div className="journal-view-body" style={viewStyleObject}>
                        {activeEntry.bodyText}
                    </div>
                    <div className={commentsPanelClassName()}>
                        <button className="journal-comments-header" onClick={commentsToggleClick} type="button">
                            <div className="journal-comments-header-left">
                                <span className="journal-comments-icon"></span>
                                <span>{t('journal.comments')} ({getCommentsForActiveEntry().length})</span>
                            </div>
                            <div className="journal-comments-header-right">
                                <span>{commentsTextArrow()}</span>
                            </div>
                        </button>
                        <div className="journal-comments-body">
                            {buildComments()}
                            <div className="journal-comments-input-row">
                                <input className="journal-comments-input" placeholder={t('journal.commentPlaceholder')} value={commentInputText} onChange={commentInputChange} type="text" />
                                <button className="journal-comments-send" onClick={addCommentClick} type="button">{t('journal.post')}</button>
                            </div>
                        </div>
                    </div>
                    {buildDeletePopup()}
                </div>
            </main>
        );
    }

    function buildScreenContent() {
        if (currentJournalScreen === "create") {
            return buildCreateScreenContent();
        }

        if (currentJournalScreen === "view") {
            return buildViewScreenContent();
        }

        return buildListScreenContent();
    }

    return (
        <div>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="journal" activeCircleId={props.activeCircleId} />
                {buildScreenContent()}
                <ActivityFeed activeCircleId={props.activeCircleId} />
            </div>
        </div>
    );
}

export default Journal
