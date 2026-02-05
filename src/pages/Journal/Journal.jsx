import './Journal.css'
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';

/*
useEffect docs: https://react.dev/reference/react/useEffect
JSON: https://www.w3schools.com/js/js_json_parse.asp
Jeremy McPeak CH.12 of Javascript Book
unshift: https://www.geeksforgeeks.org/javascript/javascript-array-unshift-method/
https://www.w3schools.com/jsref/jsref_unshift.asp
*/

function Journal(props) {
    const storageKey = "journal_entries";
    const commentsKey = "journal_comments";

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
    const [commentsByEntryId, setCommentsByEntryId] = useState({});

    // delete entry
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [deleteEntryId, setDeleteEntryId] = useState(null);

    // using JSON to store the entry locally, but will eventually be stored in the database for the user's account
    //useEffect runs after the UI loads, which will look up the value under the storage key (which is the journal entries defined above) and return a string if something is there.
    useEffect(function () {
        const savedEntriesText = localStorage.getItem(storageKey);
        // if there is something saved then the JSON string will be parsed into JS data array.
        if (savedEntriesText) {
            const parsedEntries = JSON.parse(savedEntriesText);
            if (Array.isArray(parsedEntries)) {
                setJournalEntries(parsedEntries);
            }
        }

        // same concept as entries using the comments key. if the parsed comment exists and it is an object the comment will be saved in state.
        const savedCommentsText = localStorage.getItem(commentsKey);

        if (savedCommentsText) {
            const parsedComments = JSON.parse(savedCommentsText);
            if (parsedComments && typeof parsedComments === "object") {
                setCommentsByEntryId(parsedComments);
            }
        }
    }, []);

    // when the journal entries change, convert to JSON and save it under the journal_entries so that any edits or creations are stored
    useEffect(function () {
        const textToSave = JSON.stringify(journalEntries);
        localStorage.setItem(storageKey, textToSave);
    }, [journalEntries]);

    // same function but with comments
    useEffect(function () {
        const textToSave = JSON.stringify(commentsByEntryId);
        localStorage.setItem(commentsKey, textToSave);
    }, [commentsByEntryId]);

    // creates a random ID for the entry. followed the same concept used in the journal for making a unique ID using date.now since it prevents duplicates.
    function createEntryId() {
        const timeNumber = Date.now();
        const randomNumber = Math.floor(Math.random() * 100000);
        const idText = "entry-" + timeNumber + "-" + randomNumber;
        return idText;
    }

    // loops through the journal entries and returns the object with the matching id. entry starts as null before the entry id is passed through the function.
    function findEntryById(entryId) {
        let foundEntry = null;

        let index = 0;
        while (index < journalEntries.length) {
            const currentEntry = journalEntries[index];

            if (currentEntry.id === entryId) {
                foundEntry = currentEntry;
            }

            index = index + 1;
        }

        return foundEntry;
    }

    // each journal entry has a time stamp. this function calculates how many days ago the entry was created and returns the matching number.
    function getDaysAgoText(timeNumber) {
        const nowTimeNumber = Date.now();
        const differenceNumber = nowTimeNumber - timeNumber;
        const oneDayNumber = 24 * 60 * 60 * 1000;
        const dayCount = Math.floor(differenceNumber / oneDayNumber);

        if (dayCount <= 0) {
            return "Today";
        }

        if (dayCount === 1) {
            return "1 Day Ago";
        }

        return dayCount + " Days Ago";
    }

    // filters the text entries by trimming extra space and turning it into lowercase for standard text. if the search is empty then just show the journal entries, but when the index is greater than 0 in length the while loop iterates through the entries and checks if it matches. matching entries are added into the empty array
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

    //checks if anything is empty to prevent saving empty strings
    function entryIsEmpty() {
        const trimmedTitle = entryTitleText.trim();
        const trimmedDescription = entryDescriptionText.trim();
        const trimmedBody = entryBodyText.trim();

        if (trimmedTitle.length === 0 && trimmedDescription.length === 0 && trimmedBody.length === 0) {
            return true;
        }

        return false;
    }

    // builds the text as an object with the features being passed through from the if statements. this only shows while edit mode is on
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

    // similar to last function, but is activated only when an entry (which is submit as an object) is viewed to show the styling of it
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

    // comments get displayed on entries
    function getCommentsForActiveEntry() {
        const entryId = activeEntryId;

        if (entryId === null) {
            return [];
        }

        const commentList = commentsByEntryId[entryId];

        if (commentList) {
            return commentList;
        }

        return [];
    }


    // the following functions reads the current input’s value and updates the state. when an event (the user input) is available, it's stored in the variable and passed through to the state.
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
            setEntryTitleText("Travel Memory");
            setEntryDescriptionText("Share a favorite moment from your recent adventure!");
            setEntryBodyText("Write about where you went, what you did, and what made it memorable.");
        }

        if (templateName === "happy") {
            setEntryTitleText("Happy Memory");
            setEntryDescriptionText("Write about something that made you smile today!");
            setEntryBodyText("Write what happened, why it made you happy, and what you want to remember.");
        }

        if (templateName === "growth") {
            setEntryTitleText("Growth Memory");
            setEntryDescriptionText("Reflect on something you learned recently");
            setEntryBodyText("Write what you learned, what challenged you, and how you want to apply it next time.");
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

    // these functions handle the toolbar settings in editor
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
            setActiveEntryId(entryToEdit.id);
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

    // function saves the new entry to return the id using date.now to create a unique id. entry is then turned into an object and copies what they typed into the form states previously created.
    function saveNewEntryAndReturnId() {
        const nowTimeNumber = Date.now();
        const newEntryId = createEntryId();

        const entryObject = {
            id: newEntryId,
            titleText: entryTitleText,
            shortDescriptionText: entryDescriptionText,
            bodyText: entryBodyText,
            fontName: selectedFontName,
            textAlign: selectedTextAlign,
            isBold: isBoldActive,
            isItalic: isItalicActive,
            isUnderline: isUnderlineActive,
            authorName: "Nicole",
            createdTimeNumber: nowTimeNumber,
            updatedTimeNumber: nowTimeNumber,
        };

        // by slicing the entries we create a copy to modify the duplicate and keep the original as is. then unshift is going to push this new entry to the front of the list and the state is going to update the ui to rerender.
        const updatedEntries = journalEntries.slice();
        updatedEntries.unshift(entryObject);

        setJournalEntries(updatedEntries);

        return newEntryId;
    }

    // iterates through any journal entries that are longer than 0 characters in length, if the ids match when clicked, the entry object is going to update and it will get pushed into the new array. if else is for if the entry is not being edited, which will add the original entry instead (the one not changed)
    function updateExistingEntry(entryId) {
        const nowTimeNumber = Date.now();
        const updatedEntries = [];

        let index = 0;
        while (index < journalEntries.length) {
            const currentEntry = journalEntries[index];

            if (currentEntry.id === entryId) {
                const updatedEntryObject = {
                    id: currentEntry.id,
                    titleText: entryTitleText,
                    shortDescriptionText: entryDescriptionText,
                    bodyText: entryBodyText,
                    fontName: selectedFontName,
                    textAlign: selectedTextAlign,
                    isBold: isBoldActive,
                    isItalic: isItalicActive,
                    isUnderline: isUnderlineActive,
                    authorName: currentEntry.authorName,
                    createdTimeNumber: currentEntry.createdTimeNumber,
                    updatedTimeNumber: nowTimeNumber,
                };

                updatedEntries.push(updatedEntryObject);
            } else {
                updatedEntries.push(currentEntry);
            }

            index = index + 1;
        }

        setJournalEntries(updatedEntries);
    }

    // if the user didnt type anything then do nothing. if its null we are creating a new entry and passing through the date.now from the save new entry function to return a unique id and update it. the last line is for if the comments are toggled to change the boolean and view
    function saveButtonClick() {
        if (entryIsEmpty()) {
            return;
        }

        if (activeEntryId === null) {
            const newId = saveNewEntryAndReturnId();
            setActiveEntryId(newId);
        } else {
            updateExistingEntry(activeEntryId);
        }

        setCommentsOpen(false);
        setCurrentJournalScreen("view");
    }

    // if the user wants to go back to the main entry page for the journal, pressing the back arrow will take them there
    function backArrowFromCreate() {
        if (entryIsEmpty()) {
            setCurrentJournalScreen("list");
            return;
        }

        if (activeEntryId === null) {
            const newId = saveNewEntryAndReturnId();
            setActiveEntryId(newId);
        } else {
            updateExistingEntry(activeEntryId);
        }

        setCommentsOpen(false);
        setCurrentJournalScreen("list");
    }

    // controls the opening and closing of the comments section. next 2 functions control which arrow is displayed as they are toggled.
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

    // creates the comment by trimming the text input. the if statement won't let an empty comment be submitted, and when an entry is null, it will stop.
    function addCommentClick() {
        const trimmedComment = commentInputText.trim();

        if (trimmedComment.length === 0) {
            return;
        }

        if (activeEntryId === null) {
            return;
        }

        // makes a timestamp for the comment and an object it made with the poster's information.
        const nowTimeNumber = Date.now();

        const newCommentObject = {
            id: "comment-" + nowTimeNumber,
            text: trimmedComment,
            authorName: "Nicole",
            createdTimeNumber: nowTimeNumber,
        };

        // grab the current comment and copies the array with slice. spread operator is copying the overall object that stores the comments and is replacing the active entry comments list with the new list. in the end the text box is cleared, and state is updated.
        const existingComments = getCommentsForActiveEntry();
        const updatedComments = existingComments.slice();
        updatedComments.push(newCommentObject);

        const updatedCommentsByEntryId = { ...commentsByEntryId };
        updatedCommentsByEntryId[activeEntryId] = updatedComments;

        setCommentsByEntryId(updatedCommentsByEntryId);
        setCommentInputText("");
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

    // this function rebuilds the new list of entries and skips the one that's being deleted.
    function deleteEntryById(entryId) {
        const updatedEntries = [];

        let index = 0;
        while (index < journalEntries.length) {
            const currentEntry = journalEntries[index];

            if (currentEntry.id !== entryId) {
                updatedEntries.push(currentEntry);
            }

            index = index + 1;
        }

        setJournalEntries(updatedEntries);

        // the comments from an entry id are copied as an object from spread, then deleted alongisde the entry
        const updatedComments = { ...commentsByEntryId };
        if (updatedComments[entryId]) {
            delete updatedComments[entryId];
            setCommentsByEntryId(updatedComments);
        }

        if (activeEntryId === entryId) {
            setActiveEntryId(null);
            setCurrentJournalScreen("list");
        }
    }

    function confirmDeleteClick() {
        if (deleteEntryId === null) {
            closeDeletePopup();
            return;
        }

        deleteEntryById(deleteEntryId);
        closeDeletePopup();
    }

    // prevent default stops browser, stop propagation stops the processes from running in chain. this is because i coded a button inside a button and was the only solution i could find without restructuring everything
    function createOpenDeletePopup(entryId) {
        function inputClick(clickEvent) {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            openDeletePopup(entryId);
        }
        return inputClick;
    }

    // shows the delete pop up when pressed.
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
                    <h2 className="journal-modal-title">Confirm Entry Deletion?</h2>
                    <p className="journal-modal-text">Are you sure you want to delete this entry?</p>
                    <p className="journal-modal-subtext">This action cannot be undone.</p>
                    <div className="journal-modal-buttons">
                        <button className="journal-modal-cancel" onClick={closeDeletePopup} type="button">Cancel</button>
                        <button className="journal-modal-delete" onClick={confirmDeleteClick} type="button">Delete</button>
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
                            <input className="journal-search-input" placeholder="Search for ..." value={searchText} onChange={searchTextChange} type="text" />
                            <button className="journal-new-entry-button" onClick={newEntryClick} type="button">
                                <span className="journal-new-entry-icon"><img src="/images/ui/add-entry-white.svg" alt="" /></span>
                                <span>New Entry</span>
                            </button>
                        </div>
                        <img className="journal-gray-arrow" src="/images/ui/gray-arrow.svg" alt="" />
                        <div className="journal-empty-state">
                            <p className="journal-empty-title">No entries yet.</p>
                            <p className="journal-empty-subtitle">Create your first journal entry!</p>
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
                        <input className="journal-search-input" placeholder="Search for ..." value={searchText} onChange={searchTextChange} type="text" />
                        <button className="journal-new-entry-button" onClick={newEntryClick} type="button">
                            <span className="journal-new-entry-icon"><img src="/images/ui/add-entry-white.svg" alt="" /></span>
                            <span>New Entry</span>
                        </button>
                    </div>
                    <h2 className="journal-entries-heading">Our Entries</h2>
                    <div className="journal-entries-grid">
                        {filteredEntries.map(function (entryObject) {
                            return (
                                <button key={entryObject.id} className="journal-entry-card" onClick={createOpenEntryClick(entryObject.id)} type="button" >
                                    <div className="journal-card-top-row">
                                        <h3 className="journal-card-title">{entryObject.titleText}</h3>
                                        <button className="journal-card-menu-button" onClick={createOpenDeletePopup(entryObject.id)} type="button">
                                            <span className="journal-card-menu">•••</span>
                                        </button>
                                    </div>
                                    <p className="journal-card-description">{entryObject.shortDescriptionText}</p>
                                    <div className="journal-card-bottom-row">
                                        <div className="journal-card-author">
                                            <span className="journal-card-avatar"><img src="/images/ui/user-pfp.svg" /></span>
                                            <span>{entryObject.authorName}</span>
                                        </div>
                                        <span className="journal-card-date">
                                            {getDaysAgoText(entryObject.createdTimeNumber)}
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
                    <input className="journal-title-input" value={entryTitleText} onChange={titleTextChange} placeholder="Title" type="text" />
                    <div className="journal-suggested-header">
                        <button className="journal-suggested-toggle" onClick={suggestedToggle} type="button">
                            <span>Suggested Entries</span>
                            <span className="journal-suggested-arrow">{suggestedTextArrow()}</span>
                        </button>
                    </div>
                    {suggestedEntriesOpen && (
                        <div className="journal-suggested-cards">
                            <button className="journal-suggested-card" onClick={handleTravelTemplateClick} type="button">
                                <p className="journal-suggested-title">Travel Memory</p>
                                <p className="journal-suggested-text">Share a favorite moment from your recent adventure!</p>
                            </button>
                            <button className="journal-suggested-card" onClick={handleHappyTemplateClick} type="button">
                                <p className="journal-suggested-title">Happy Memory</p>
                                <p className="journal-suggested-text">Write about something that made you smile today!</p>
                            </button>
                            <button className="journal-suggested-card" onClick={handleGrowthTemplateClick} type="button">
                                <p className="journal-suggested-title">Growth Memory</p>
                                <p className="journal-suggested-text">Reflect on something you learned recently</p>
                            </button>
                        </div>
                    )}
                    <input className="journal-description-input" value={entryDescriptionText} onChange={descriptionChange} placeholder="Write a short description here" type="text" />
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
                        <textarea className="journal-textarea" placeholder="Write your words here..." value={entryBodyText} onChange={bodyTextChange} style={editorToolBar}></textarea>
                    </div>
                    <div className="journal-save-row">
                        <button className="journal-save-button" onClick={saveButtonClick} type="button">Save</button>
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
                    <p>No comments yet.</p>
                    <p>Write the first comment!</p>
                </div>
            );
        }

        // object is mapped out with .map to clean up code and repeat the rendering of submitted comments
        return (
            <div className="journal-comments-list">
                {commentList.map(function (commentObject) {
                    return (
                        <div key={commentObject.id} className="journal-comment">
                            <p className="journal-comment-text">{commentObject.text}</p>
                            <p className="journal-comment-meta">{commentObject.authorName}</p>
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
                        <p>Entry not found.</p>
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
                            <span>Edit</span>
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
                                <span className="journal-comments-icon">💬</span>
                                <span>Comments</span>
                            </div>
                            <div className="journal-comments-header-right">
                                <span>{commentsTextArrow()}</span>
                            </div>
                        </button>
                        <div className="journal-comments-body">
                            {buildComments()}
                            <div className="journal-comments-input-row">
                                <input className="journal-comments-input" placeholder="Add a comment..." value={commentInputText} onChange={commentInputChange} type="text" />
                                <button className="journal-comments-send" onClick={addCommentClick} type="button" >Post</button>
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
                <Navbar activePage="journal" />
                {buildScreenContent()}
                <ActivityFeed />
            </div>
        </div>
    );
}

export default Journal
