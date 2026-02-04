import './MemoryBoard.css'
import { useState } from "react";
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';

function MemoryBoard(props) {
    const [memoryItems, setMemoryItems] = useState([]);

    // delete popup, imported over from the journal but made to match memoryboard
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [deleteMemoryId, setDeleteMemoryId] = useState(null);

    // math to track how many days since a new memory was shared
    function daysAgoText(timeNumber) {
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

    function newMemoryClick() {
        // for now this is just a placeholder. it should eventually switch screens to the layout selection
        console.log("new memory clicked");
    }

    function openMemory(memoryId) {
        // for now this is just a placeholder. it should eventually switch screens to the memory opened by tracking the id
        console.log("open memory: " + memoryId);
    }

    // delete pop up should show when button is pressed on a memory. id of the memory gets passed through the function to target it. would probably work as an object when created but TBD
    function openDeletePopup(memoryId) {
        setDeleteMemoryId(memoryId);
        setDeletePopupOpen(true);
    }

    function closeDeletePopup() {
        setDeletePopupOpen(false);
        setDeleteMemoryId(null);
    }

    // deletes the selected memory by getting the id passing into it, iterates through the while loop, and keeps only ids that don't match. the new list is pushed into a new array to show current memories and is rebuilt into state
    function deleteMemoryById(memoryId) {
        const updatedList = [];

        let index = 0;
        while (index < memoryItems.length) {
            const currentItem = memoryItems[index];

            if (currentItem.id !== memoryId) {
                updatedList.push(currentItem);
            }

            index = index + 1;
        }

        setMemoryItems(updatedList);
    }

    // confirmation of deletion
    function confirmDeleteClick() {
        if (deleteMemoryId === null) {
            closeDeletePopup();
            return;
        }

        deleteMemoryById(deleteMemoryId);
        closeDeletePopup();
    }

    // button inside a button in the jsx, so when the pop up occurs certain browser events need to be stopped with these methods
    function createOpenDeletePopup(memoryId) {
        function inputClick(clickEvent) {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            openDeletePopup(memoryId);
        }
        return inputClick;
    }

    function buildDeletePopup() {
        if (deletePopupOpen === false) {
            return null;
        }

        return (
            <div className="memoryboard-overlay">
                <div className="memoryboard-card">
                    <div className="memoryboard-icon-wrap">
                        <img className="memoryboard-icon" src="/images/ui/trash.svg" alt="" />
                    </div>
                    <h2 className="memoryboard-title">Delete this memory?</h2>
                    <p className="memoryboard-text">Are you sure you want to delete this memory?</p>
                    <p className="memoryboard-subtext">This action cannot be undone.</p>
                    <div className="memoryboard-buttons">
                        <button className="memoryboard-cancel" onClick={closeDeletePopup} type="button">Cancel</button>
                        <button className="memoryboard-delete" onClick={confirmDeleteClick} type="button">Delete</button>
                    </div>
                </div>
            </div>
        );
    }

    function buildListScreenContent() {
        if (memoryItems.length === 0) {
            return (
                <main className='manage-main'>
                    <div className="memoryboard-panel memoryboard-panel-relative">
                        <div className="memoryboard-list-top-row">
                            <button className="memoryboard-new-button" onClick={newMemoryClick} type="button">
                                <span className="memoryboard-new-icon">
                                    <img src="/images/ui/add-button.svg" alt="" />
                                </span>
                            </button>
                        </div>
                        <img className="memoryboard-gray-arrow" src="/images/ui/gray-arrow.svg" alt="" />
                        <div className="memoryboard-empty-state">
                            <p className="memoryboard-empty-title">No memories yet.</p>
                            <p className="memoryboard-empty-subtitle">Add your first memory to the board!</p>
                        </div>
                        {buildDeletePopup()}
                    </div>
                </main>
            );
        }

        return (
            <main className='manage-main'>
                <div className="memoryboard-panel">
                    <div className="memoryboard-list-top-row">
                        <button className="memoryboard-new-button" onClick={newMemoryClick} type="button">
                            <span className="memoryboard-new-icon">
                                <img src="/images/ui/add-button.svg" alt="" />
                            </span>
                            <span>New Memory</span>
                        </button>
                    </div>
                    <h2 className="memoryboard-heading">Our Memories</h2>
                    <div className="memoryboard-grid">
                        {memoryItems.map(function (memoryObject) {
                            return (
                                <button key={memoryObject.id} className="memoryboard-card" onClick={function () { openMemory(memoryObject.id); }} type="button">
                                    <div className="memoryboard-card-top-row">
                                        <h3 className="memoryboard-card-title">{memoryObject.titleText}</h3>
                                        <button className="memoryboard-card-menu-button" onClick={createOpenDeletePopup(memoryObject.id)} type="button">
                                            <span className="memoryboard-card-menu">•••</span>
                                        </button>
                                    </div>
                                    <p className="memoryboard-card-description">{memoryObject.shortDescriptionText}</p>
                                    <div className="memoryboard-card-bottom-row">
                                        <div className="memoryboard-card-author">
                                            <span className="memoryboard-card-avatar">
                                                <img src="/images/ui/user-pfp.svg" alt="" />
                                            </span>
                                            <span>{memoryObject.authorName}</span>
                                        </div>
                                        <span className="memoryboard-card-date">
                                            {daysAgoText(memoryObject.createdTimeNumber)}
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

    return (
        <div>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="memoryboard" />
                {buildListScreenContent()}
                <ActivityFeed />
            </div>
        </div>
    );
}

export default MemoryBoard
