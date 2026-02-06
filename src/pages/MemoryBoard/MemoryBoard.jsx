import './MemoryBoard.css'
import { useState } from "react";
import Header from "../../components/Header/Header"
import Navbar from '../../components/Navbar/Navbar';
import ActivityFeed from '../../components/Activity Feed/ActivityFeed';

/*
References:
HTML DOM creatObjectURL(): https://www.geeksforgeeks.org/html/html-dom-createobjecturl-method/
Unshift: https://www.w3schools.com/jsref/jsref_unshift.asp
Colorpicker: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/color

*/

function MemoryBoard(props) {
    const [memoryItems, setMemoryItems] = useState([]);
    const [memoryboardScreen, setMemoryboardScreen] = useState("list");
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [layoutPageNumber, setLayoutPageNumber] = useState(1);
    const [layoutPageCount, setLayoutPageCount] = useState(1);
    const [boardTitleText, setBoardTitleText] = useState("Board 1");
    const [editingBoardTitle, setEditingBoardTitle] = useState(false);
    const [boardTitleDraftText, setBoardTitleDraftText] = useState("Board 1");
    const [layoutEditMode, setLayoutEditMode] = useState(true);
    const [slotImageMap, setSlotImageMap] = useState({});
    const [uploadSlotKey, setUploadSlotKey] = useState(null);
    const [activeBoardId, setActiveBoardId] = useState(null);
    const [viewBoardId, setViewBoardId] = useState(null);
    const [openBoardMenuId, setOpenBoardMenuId] = useState(null);
    const [editingCoverBoardId, setEditingCoverBoardId] = useState(null);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [deleteMemoryId, setDeleteMemoryId] = useState(null);
    const [borderColorValue, setBorderColorValue] = useState("#5245B5");
    const [borderWeightNumber, setBorderWeightNumber] = useState(3);
    const [borderColorOpen, setBorderColorOpen] = useState(false);
    const [borderWeightOpen, setBorderWeightOpen] = useState(false);

    // functon will take the user to the main screen with the list of boards
    function goToListScreen() {
        setMemoryboardScreen("list");
        setSelectedTemplateId(null);
        setLayoutPageNumber(1);
        setLayoutPageCount(1);
        setEditingBoardTitle(false);
        setLayoutEditMode(true);
        setUploadSlotKey(null);
        setActiveBoardId(null);
        setViewBoardId(null);
        setOpenBoardMenuId(null);
        setEditingCoverBoardId(null);
        setBorderColorOpen(false);
        setBorderWeightOpen(false);
    }

    // after the user presses the add button, this function is called and sets these settings returned from the functions to show the template screen
    function goToTemplateScreen() {
        setMemoryboardScreen("templates");
        setSelectedTemplateId(null);
        setLayoutPageNumber(1);
        setLayoutPageCount(1);
        setEditingBoardTitle(false);
        setLayoutEditMode(true);
        setUploadSlotKey(null);
        setActiveBoardId(null);
        setViewBoardId(null);
        setOpenBoardMenuId(null);
        setEditingCoverBoardId(null);
        setBorderColorOpen(false);
        setBorderWeightOpen(false);
    }

    // when a template is selected, the template is given an id and the user can see the template. functions are called to show/build the elements of this page
    function goToLayoutScreen(templateId) {
        setSelectedTemplateId(templateId);
        setMemoryboardScreen("layout");
        setLayoutPageNumber(1);
        setLayoutPageCount(1);
        setBoardTitleText("Board 1");
        setBoardTitleDraftText("Board 1");
        setEditingBoardTitle(false);
        setLayoutEditMode(true);
        setSlotImageMap({});
        setUploadSlotKey(null);
        setActiveBoardId(null);
        setViewBoardId(null);
        setOpenBoardMenuId(null);
        setEditingCoverBoardId(null);
        setBorderColorValue("#5245B5");
        setBorderWeightNumber(3);
        setBorderColorOpen(false);
        setBorderWeightOpen(false);
    }

    function newMemoryClick() {
        goToTemplateScreen();
    }

    // creates a random id for the memory board for easier targeting/tracking
    function createMemoryBoardId() {
        const timeNumber = Date.now();
        const randomNumber = Math.floor(Math.random() * 100000);
        const idText = "memory-" + timeNumber + "-" + randomNumber;
        return idText;
    }

    // finds a memory by id
    function findMemoryById(memoryId) {
        let found = null;

        let index = 0;
        while (index < memoryItems.length) {
            const currentItem = memoryItems[index];

            if (currentItem.id === memoryId) {
                found = currentItem;
            }

            index = index + 1;
        }

        return found;
    }

    // when a saved memory is clicked, open the non editing mode screen to preview the board. this is only if there is a board already stored since its going to grab the id that is passed into it and then run the functions inside of the function
    function openMemory(memoryId) {
        const memoryObject = findMemoryById(memoryId);

        if (memoryObject === null) {
            return;
        }

        setViewBoardId(memoryObject.id);
        setSelectedTemplateId(memoryObject.templateId);
        setLayoutPageCount(memoryObject.pageCount);
        setLayoutPageNumber(1);
        setBoardTitleText(memoryObject.titleText);
        setBoardTitleDraftText(memoryObject.titleText);
        setEditingBoardTitle(false);
        setSlotImageMap(memoryObject.slotImageMap || {});
        setUploadSlotKey(null);
        setBorderColorValue(memoryObject.borderColorValue || "#5245B5");
        setBorderWeightNumber(memoryObject.borderWeightNumber || 3);
        setLayoutEditMode(false);
        setBorderColorOpen(false);
        setBorderWeightOpen(false);
        setMemoryboardScreen("view");
    }

    // when the edit button is pressed from the preview screen the functions will run. a screen with no id won;t work
    // Claude 2/5. "The button wont display the edit button. Pinpoint what is causing the error" (assisted in finding that id was not being passed properly)
    function editFromPreviewClick() {
        if (viewBoardId === null) {
            return;
        }

        const memoryObject = findMemoryById(viewBoardId);

        if (memoryObject === null) {
            return;
        }

        setActiveBoardId(memoryObject.id);
        setSelectedTemplateId(memoryObject.templateId);
        setLayoutPageCount(memoryObject.pageCount);
        setLayoutPageNumber(1);
        setBoardTitleText(memoryObject.titleText);
        setBoardTitleDraftText(memoryObject.titleText);
        setEditingBoardTitle(false);
        setSlotImageMap(memoryObject.slotImageMap || {});
        setUploadSlotKey(null);
        setBorderColorValue(memoryObject.borderColorValue || "#5245B5");
        setBorderWeightNumber(memoryObject.borderWeightNumber || 3);
        setLayoutEditMode(true);
        setBorderColorOpen(false);
        setBorderWeightOpen(false);
        setMemoryboardScreen("layout");
    }

    // template data!! :3 there are 6 templates. each template is given its own id and a label to differentiate them in the css.
    function getTemplatesList() {
        return [
            { id: "template-1", label: "Template 1" },
            { id: "template-2", label: "Template 2" },
            { id: "template-3", label: "Template 3" },
            { id: "template-4", label: "Template 4" },
            { id: "template-5", label: "Template 5" },
            { id: "template-6", label: "Template 6" },
        ];
    }

    // this function runs the function for the user to choose a template and then return the correct one based off of the one they picked.
    function chooseTemplate(templateId) {
        function chooseTemplateClick() {
            goToLayoutScreen(templateId);
        }
        return chooseTemplateClick;
    }

    // each template has a small preview box, so when the correct id that was set to the template is passed through the function it will return the correct svg to the preview. originally tried to hand code this out but it was too difficult so it would resize better, i ended up adding the svgs instead. may end up causing possile resizing issues
    function buildTemplateBoxPreview(templateId) {
        if (templateId === "template-1") {
            return <img className="memoryboard-template-image" src="/images/ui/template1.svg" alt="template1" />;
        }

        if (templateId === "template-2") {
            return <img className="memoryboard-template-image" src="/images/ui/template2.svg" alt="template2" />;
        }

        if (templateId === "template-3") {
            return <img className="memoryboard-template-image" src="/images/ui/template3.svg" alt="template3" />;
        }

        if (templateId === "template-4") {
            return <img className="memoryboard-template-image" src="/images/ui/template4.svg" alt="template4" />;
        }

        if (templateId === "template-5") {
            return <img className="memoryboard-template-image" src="/images/ui/template5.svg" alt="template5" />;
        }

        return <img className="memoryboard-template-image" src="/images/ui/template6.svg" alt="template6" />;
    }

    function templateSelectionContent() {
        const templates = getTemplatesList();

        return (
            <main className='manage-main'>
                <div className="memoryboard-panel">
                    <div className="memoryboard-templates-top-row">
                        <button className="memoryboard-back-button" onClick={goToListScreen} type="button">
                            <img src="/images/ui/back-arrow.svg" alt="Back arrow" />
                        </button>
                        <h2 className="memoryboard-templates-heading">Your Layouts</h2>
                        <div className="memoryboard-templates-right-spacer"></div>
                    </div>

                    <div className="memoryboard-templates-grid">
                        {templates.map(function (templateObject) {
                            return (
                                <button key={templateObject.id} className="memoryboard-template-card" onClick={chooseTemplate(templateObject.id)} type="button">{buildTemplateBoxPreview(templateObject.id)}</button>
                            );
                        })}
                    </div>
                </div>
            </main>
        );
    }

    // when a template is pressed, each "slot" aka the box that the image will be sitting in is going to have an id attached to it and a classname. the reason for this is so that in the css the slots are positioned to how they are in the figma design
    function buildLayoutSlotsForTemplate(templateId) {
        if (templateId === "template-1") {
            return [
                { id: "a", className: "slot-a square" },
                { id: "b", className: "slot-b square" },
                { id: "c", className: "slot-c square" },
                { id: "d", className: "slot-d square" },
                { id: "e", className: "slot-e square" },
                { id: "f", className: "slot-f square" },
            ];
        }

        if (templateId === "template-2") {
            return [
                { id: "a", className: "slot-a square" },
                { id: "b", className: "slot-b wide" },
                { id: "c", className: "slot-c wide" },
                { id: "d", className: "slot-d square" },
                { id: "e", className: "slot-e square" },
                { id: "f", className: "slot-f wide" },
            ];
        }

        if (templateId === "template-3") {
            return [
                { id: "a", className: "slot-a tall" },
                { id: "b", className: "slot-b tall" },
                { id: "c", className: "slot-c tall" },
                { id: "d", className: "slot-d tall" },
                { id: "e", className: "slot-e tall" },
                { id: "f", className: "slot-f tall" },
            ];
        }

        if (templateId === "template-4") {
            return [
                { id: "a", className: "slot-a tall" },
                { id: "b", className: "slot-b tall" },
                { id: "c", className: "slot-c tall" },
                { id: "d", className: "slot-d tall" },
                { id: "e", className: "slot-e tall" },
                { id: "f", className: "slot-f tall" },
                { id: "g", className: "slot-g tall" },
            ];
        }

        if (templateId === "template-5") {
            return [
                { id: "a", className: "slot-a square" },
                { id: "b", className: "slot-b square" },
                { id: "c", className: "slot-c square" },
                { id: "d", className: "slot-d tall" },
                { id: "e", className: "slot-e tall" },
                { id: "f", className: "slot-f square" },
                { id: "g", className: "slot-g square" },
                { id: "h", className: "slot-h square" },
            ];
        }

        // template-6, no if statement since its the last one so its made the default one
        return [
            { id: "a", className: "slot-a square" },
            { id: "b", className: "slot-b wide" },
            { id: "c", className: "slot-c square" },
            { id: "d", className: "slot-d wide" },
            { id: "e", className: "slot-e square" },
            { id: "f", className: "slot-f wide" },
        ];
    }

    // tells which slot was selected (also used for debugging)
    function createSlotClick(slotId) {
        function slotClick() {
            console.log("slot clicked: " + slotId);
        }
        return slotClick;
    }

    // tracking the page number so that when the next page is active page 2 will appear different. makes it easy to reference later
    function buildSlotKey(pageNumber, slotId) {
        return pageNumber + "-" + slotId;
    }

    function buildSlotBorderStyle() {
        return {
            border: borderWeightNumber + "px solid " + borderColorValue,
        };
    }

    // function for the file picker for images in each slot.
    // https://www.geeksforgeeks.org/html/html-dom-createobjecturl-method/

    // when edit mode is false do nothing. if active its going to pass the page number and the id into the function and store the return in the key variable.
    function openFilePicker(slotId) {
        if (layoutEditMode === false) {
            return;
        }

        const key = buildSlotKey(layoutPageNumber, slotId);
        setUploadSlotKey(key);

        // use DOM to grab the input element on the page with the matching it, and check if the file exists before executing the code.
        const fileInput = document.getElementById("memoryboard-file-input");
        if (fileInput) {
            fileInput.value = null;
            fileInput.click();
        }
    }

    // when there is a change detected (such as with photo upload) the function targets the select file. if its null it stops.
    function fileInputChange(changeEvent) {
        if (uploadSlotKey === null) {
            return;
        }

        // target the file the was submit from the changed event, and if there is no file or the length of it is 0, stop executing. this means the user has backed out of the upload.
        const fileList = changeEvent.target.files;
        if (!fileList || fileList.length === 0) {
            return;
        }

        // the first image in the list is grabbed and put into the html DOM method by letting it show up in the img tag. afterwards, and object is created using the slot image. while loop checks that the length of the object is more than 0, and then copies everything from slot image into the updated map.
        const fileObject = fileList[0];
        const imageUrl = URL.createObjectURL(fileObject);

        const updatedMap = {};
        const keys = Object.keys(slotImageMap);

        let index = 0;
        while (index < keys.length) {
            const keyName = keys[index];
            updatedMap[keyName] = slotImageMap[keyName];
            index = index + 1;
        }

        // after it runs, this sets the slot to have the new image
        updatedMap[uploadSlotKey] = imageUrl;
        setSlotImageMap(updatedMap);
    }

    // each slot has an icon to upload a photo. this function lets the upload functionality occur by running the slots id into it and then running the uploadClick function that occurs when the user presses the button. prevent default and stoppropagation stop default behavior from triggering in the slot after the button click
    function createUploadClick(slotId) {
        function uploadClick(clickEvent) {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            openFilePicker(slotId);
        }
        return uploadClick;
    }

    // makes the key for the slot so that even if someone clicks on page two, the slot will be different from the one on page 1.
    function buildLayoutSlot(slotObject) {
        const slotKey = buildSlotKey(layoutPageNumber, slotObject.id);
        const slotImageUrl = slotImageMap[slotKey];
        const borderStyle = buildSlotBorderStyle();

        return (
            <button key={slotObject.id} className={"memoryboard-layout-slot " + slotObject.className} onClick={createSlotClick(slotObject.id)} type="button" style={borderStyle}>
                {slotImageUrl && (
                    <img className="memoryboard-slot-image" src={slotImageUrl} alt="" />
                )}
                {layoutEditMode && (
                    <span className="memoryboard-slot-upload" onClick={createUploadClick(slotObject.id)} role="button" tabIndex={0}><img src="/images/ui/add-image.svg" alt="" /></span>
                )}
            </button>
        );
    }

    // picks a cover image for the memory board submission by using the image in the first slot. it loops through the keys from slot image and checks if it starts with the 1- key. if it does it returns that url to the cover (since the DOM stored the image as a url)
    function getDefaultCoverPhoto() {
        const keys = Object.keys(slotImageMap);

        let index = 0;
        while (index < keys.length) {
            const keyName = keys[index];

            if (keyName.startsWith("1-")) {
                const url = slotImageMap[keyName];
                if (url) {
                    return url;
                }
            }

            index = index + 1;
        }

        return null;
    }

    // captures the current layout and saves it in memooryitems to show that its essentially completed. it saves all of the settings that the user changed such as the title and the images uploaded. date.now also adds the submission creation
    function saveBoardToList() {
        const nowTimeNumber = Date.now();

        let finalTitle = boardTitleDraftText.trim();
        if (finalTitle.length === 0) {
            finalTitle = "Board 1";
        }

        const coverUrl = getDefaultCoverPhoto();

        let boardIdToUse = activeBoardId;
        if (boardIdToUse === null) {
            boardIdToUse = createMemoryBoardId();
            setActiveBoardId(boardIdToUse);
        }

        // final board saved into an object
        const boardObject = {
            id: boardIdToUse,
            titleText: finalTitle,
            templateId: selectedTemplateId,
            pageCount: layoutPageCount,
            coverImageUrl: coverUrl,
            slotImageMap: slotImageMap,
            authorName: "Nicole",
            createdTimeNumber: nowTimeNumber,
            borderColorValue: borderColorValue,
            borderWeightNumber: borderWeightNumber,
        };

        const updatedList = [];
        let found = false;

        // loops through every saved board and grab the current memory board thats being looked at. if the ids match, then replace the older version with the newly updated board. if the board was never found, then that means its a new memory and unshift moves it to the top of the list.
        let index = 0;
        while (index < memoryItems.length) {
            const currentItem = memoryItems[index];

            if (currentItem.id === boardIdToUse) {
                updatedList.push(boardObject);
                found = true;
            } else {
                updatedList.push(currentItem);
            }

            index = index + 1;
        }

        if (found === false) {
            updatedList.unshift(boardObject);
        }

        setMemoryItems(updatedList);
    }

    // leaves the editiing mode and fixes the title before exiting
    function saveAndExitEdit() {
        const trimmedTitle = boardTitleDraftText.trim();

        if (trimmedTitle.length === 0) {
            setBoardTitleText("Board 1");
            setBoardTitleDraftText("Board 1");
        } else {
            setBoardTitleText(trimmedTitle);
            setBoardTitleDraftText(trimmedTitle);
        }

        setEditingBoardTitle(false);
        setLayoutEditMode(false);

        setBorderColorOpen(false);
        setBorderWeightOpen(false);

        saveBoardToList();
    }

    // back arrow on active layout saves the board, adds it to the main list, and takes you back
    function backFromLayoutClick() {
        if (layoutEditMode) {
            saveAndExitEdit();
        } else {
            saveBoardToList();
        }

        goToListScreen();
    }

    // back arrow on preview takes you to the main board list
    function backFromPreviewClick() {
        goToListScreen();
    }

    function addSecondBoardClick() {
        if (layoutEditMode === false) {
            return;
        }

        setLayoutPageCount(2);
        setLayoutPageNumber(2);
    }

    function goToPreviousBoard() {
        setLayoutPageNumber(1);
    }

    function goToNextBoard() {
        setLayoutPageNumber(2);
    }

    function buildLayoutFloatingButton() {
        if (layoutPageCount === 1) {
            if (layoutEditMode) {
                return (
                    <button className="memoryboard-floating-plus memoryboard-floating-right" onClick={addSecondBoardClick} type="button">
                        <img src="/images/ui/add-button.svg" alt="" />
                    </button>
                );
            }

            return null;
        }

        if (layoutPageNumber === 2) {
            return (
                <button className="memoryboard-floating-plus memoryboard-floating-left" onClick={goToPreviousBoard} type="button">
                    <img src="/images/ui/left-arrow-circle.svg" alt="" />
                </button>
            );
        }

        return (
            <button className="memoryboard-floating-plus memoryboard-floating-right" onClick={goToNextBoard} type="button">
                <img src="/images/ui/right-arrow-circle.svg" alt="" />
            </button>
        );
    }

    function buildPreviewFloatingButton() {
        if (layoutPageCount !== 2) {
            return null;
        }

        if (layoutPageNumber === 2) {
            return (
                <button className="memoryboard-floating-plus memoryboard-floating-left" onClick={goToPreviousBoard} type="button">
                    <img src="/images/ui/left-arrow-circle.svg" alt="" />
                </button>
            );
        }

        return (
            <button className="memoryboard-floating-plus memoryboard-floating-right" onClick={goToNextBoard} type="button">
                <img src="/images/ui/right-arrow-circle.svg" alt="" />
            </button>
        );
    }

    function buildLayoutHeading() {
        if (editingBoardTitle) {
            return (
                <input className="memoryboard-layout-heading-input" type="text" value={boardTitleDraftText} onChange={function (event) { setBoardTitleDraftText(event.target.value); }} />
            );
        }

        return (
            <h2 className="memoryboard-layout-heading" onClick={function () {
                if (layoutEditMode === false) {
                    return;
                }
                setEditingBoardTitle(true);
                setBoardTitleDraftText(boardTitleText);
            }}>
                {boardTitleText}
            </h2>
        );
    }

    // claude. 2/5. "Help me implement a drop down for letting the user select their own border color in the toolbar building off of what I already have. explain where I went wrong."
    // had some difficulty getting this one to work properly with the color input type.
    function toggleBorderColorDropdownClick() {
        if (layoutEditMode === false) {
            return;
        }

        if (borderColorOpen) {
            setBorderColorOpen(false);
            return;
        }

        setBorderColorOpen(true);
        setBorderWeightOpen(false);
    }

    function toggleBorderWeightDropdownClick() {
        if (layoutEditMode === false) {
            return;
        }

        if (borderWeightOpen) {
            setBorderWeightOpen(false);
            return;
        }

        setBorderWeightOpen(true);
        setBorderColorOpen(false);
    }

    function borderColorInputChange(changeEvent) {
        const inputElement = changeEvent.target;
        const newColor = inputElement.value;
        setBorderColorValue(newColor);
    }

    function borderWeightSelectChange(changeEvent) {
        const inputElement = changeEvent.target;
        const newWeightText = inputElement.value;
        const newWeightNumber = parseInt(newWeightText, 10);

        if (isNaN(newWeightNumber)) {
            return;
        }

        setBorderWeightNumber(newWeightNumber);
    }

    function buildBorderColorDropdown() {
        if (borderColorOpen === false) {
            return null;
        }

        return (
            <div className="memoryboard-tool-dropdown">
                <input type="color" value={borderColorValue} onChange={borderColorInputChange} />
            </div>
        );
    }

    function buildBorderWeightDropdown() {
        if (borderWeightOpen === false) {
            return null;
        }

        return (
            <div className="memoryboard-tool-dropdown">
                <select value={borderWeightNumber} onChange={borderWeightSelectChange}>
                    <option value={1}>1px</option>
                    <option value={2}>2px</option>
                    <option value={3}>3px</option>
                    <option value={4}>4px</option>
                    <option value={5}>5px</option>
                </select>
            </div>
        );
    }

    function buildLayoutToolbar() {
        if (layoutEditMode === false) {
            return null;
        }

        return (
            <div className="memoryboard-layout-tools">
                <div className="memoryboard-tool-wrap">
                    <button className="memoryboard-tool-button" onClick={toggleBorderColorDropdownClick} type="button">
                        <img src="/images/ui/border-color.svg" alt="border color" />
                    </button>
                    {buildBorderColorDropdown()}
                </div>
                <div className="memoryboard-tool-divider"></div>
                <div className="memoryboard-tool-wrap">
                    <button className="memoryboard-tool-button" onClick={toggleBorderWeightDropdownClick} type="button">
                        <img src="/images/ui/border-weight.svg" alt="Border weight" />
                    </button>
                    {buildBorderWeightDropdown()}
                </div>
            </div>
        );
    }

    function buildLayoutTopRightButton() {
        if (layoutEditMode) {
            return (
                <button className="memoryboard-save-button" onClick={saveAndExitEdit} type="button">
                    <img src="/images/ui/checkmark.svg" alt="checkmark" />
                </button>
            );
        }

        return (
            <button className="memoryboard-save-button" onClick={function () { setLayoutEditMode(true); }} type="button">
                <img src="/images/ui/edit-button-purple.svg" alt="" />
            </button>
        );
    }

    function buildLayoutScreenContent() {
        const slots = buildLayoutSlotsForTemplate(selectedTemplateId);

        return (
            <main className='manage-main'>
                <div className="memoryboard-panel">
                    <div className="memoryboard-layout-top-row">
                        <button className="memoryboard-back-button" onClick={backFromLayoutClick} type="button">
                            <img src="/images/ui/back-arrow.svg" alt="" />
                        </button>
                        {buildLayoutToolbar()}
                        {buildLayoutTopRightButton()}
                    </div>
                    {buildLayoutHeading()}
                    <input id="memoryboard-file-input" type="file" accept="image/*" onChange={fileInputChange} style={{ display: "none" }} />
                    <div className={"memoryboard-layout-grid " + selectedTemplateId}>
                        {slots.map(function (slotObject) {
                            return buildLayoutSlot(slotObject);
                        })}
                    </div>
                    {buildLayoutFloatingButton()}
                </div>
            </main>
        );
    }

    function buildPreviewScreenContent() {
        const slots = buildLayoutSlotsForTemplate(selectedTemplateId);

        return (
            <main className='manage-main'>
                <div className="memoryboard-panel">
                    <div className="memoryboard-layout-top-row">
                        <button className="memoryboard-back-button" onClick={backFromPreviewClick} type="button">
                            <img src="/images/ui/back-arrow.svg" alt="back arrow" />
                        </button>
                        <div></div>
                        <button className="memoryboard-save-button" onClick={editFromPreviewClick} type="button">
                            <img src="/images/ui/edit-button-purple.svg" alt="" />
                        </button>
                    </div>
                    <h2 className="memoryboard-layout-heading">
                        {boardTitleText}
                    </h2>
                    <div className={"memoryboard-layout-grid " + selectedTemplateId}>
                        {slots.map(function (slotObject) {
                            return buildLayoutSlot(slotObject);
                        })}
                    </div>
                    {buildPreviewFloatingButton()}
                </div>
            </main>
        );
    }

    // opens an additional pop up to adjust settings on a memory. targets the click event and grabs the memory's id to push it through the toggle function.
    function toggleBoardMenuClick(clickEvent, memoryId) {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();

        if (openBoardMenuId === memoryId) {
            setOpenBoardMenuId(null);
            return;
        }

        setOpenBoardMenuId(memoryId);
    }

    function openDeletePopup(memoryId) {
        setDeleteMemoryId(memoryId);
        setDeletePopupOpen(true);
        setOpenBoardMenuId(null);
    }

    function closeDeletePopup() {
        setDeletePopupOpen(false);
        setDeleteMemoryId(null);
    }

    function openCoverPhotoPicker(memoryId) {
        setEditingCoverBoardId(memoryId);
        setOpenBoardMenuId(null);

        const fileInput = document.getElementById("memoryboard-cover-file-input");
        if (fileInput) {
            fileInput.value = null;
            fileInput.click();
        }
    }

    // functions the same as the color picker function for the slots created earlier
    function coverFileInputChange(changeEvent) {
        if (editingCoverBoardId === null) {
            return;
        }

        const fileList = changeEvent.target.files;
        if (!fileList || fileList.length === 0) {
            setEditingCoverBoardId(null);
            return;
        }

        const fileObject = fileList[0];
        const imageUrl = URL.createObjectURL(fileObject);

        const updatedList = [];

        let index = 0;
        while (index < memoryItems.length) {
            const currentItem = memoryItems[index];

            if (currentItem.id === editingCoverBoardId) {
                const updatedItem = {
                    id: currentItem.id,
                    titleText: currentItem.titleText,
                    templateId: currentItem.templateId,
                    pageCount: currentItem.pageCount,
                    coverImageUrl: imageUrl,
                    slotImageMap: currentItem.slotImageMap,
                    authorName: currentItem.authorName,
                    createdTimeNumber: currentItem.createdTimeNumber,
                    borderColorValue: currentItem.borderColorValue,
                    borderWeightNumber: currentItem.borderWeightNumber,
                };

                updatedList.push(updatedItem);
            } else {
                updatedList.push(currentItem);
            }

            index = index + 1;
        }

        setMemoryItems(updatedList);
        setEditingCoverBoardId(null);
    }


    // loops through and finds the memory id that doesn't match, then updates the empty array with the new list.
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

    function confirmDeleteClick() {
        if (deleteMemoryId === null) {
            closeDeletePopup();
            return;
        }

        deleteMemoryById(deleteMemoryId);
        closeDeletePopup();
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
                    <h2 className="memoryboard-title">Delete this memory board?</h2>
                    <p className="memoryboard-text">Are you sure you want to delete this memory board?</p>
                    <p className="memoryboard-subtext">This action cannot be undone.</p>
                    <div className="memoryboard-buttons">
                        <button className="memoryboard-cancel" onClick={closeDeletePopup} type="button">Cancel</button>
                        <button className="memoryboard-delete" onClick={confirmDeleteClick} type="button">Delete</button>
                    </div>
                </div>
            </div>
        );
    }

    function buildBoardCardMenu(memoryId) {
        if (openBoardMenuId !== memoryId) {
            return null;
        }

        return (
            <div className="memoryboard-card-menu-popover">
                <button className="memoryboard-card-menu-item" onClick={function (clickEvent) { clickEvent.preventDefault(); clickEvent.stopPropagation(); openCoverPhotoPicker(memoryId); }} type="button">
                    <span className="memoryboard-card-menu-icon"><img src="/images/ui/edit-button.svg" /></span>
                    <span>Change Cover</span>
                </button>
                <button className="memoryboard-card-menu-item" onClick={function (clickEvent) { clickEvent.preventDefault(); clickEvent.stopPropagation(); openDeletePopup(memoryId); }} type="button">
                    <span className="memoryboard-card-menu-icon"><img src="/images/ui/trash.svg" /></span>
                    <span>Delete</span>
                </button>
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
                        <input id="memoryboard-cover-file-input" type="file" accept="image/*" onChange={coverFileInputChange} style={{ display: "none" }} />
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
                        </button>
                    </div>
                    <h2 className="memoryboard-heading">Your Memories</h2>
                    <div className="memoryboard-grid">
                        {memoryItems.map(function (memoryObject) {
                            const coverUrl = memoryObject.coverImageUrl;

                            return (
                                <button key={memoryObject.id} className="memoryboard-cover-card" onClick={function () { openMemory(memoryObject.id); }} type="button">
                                    <div className="memoryboard-cover-image-wrap">
                                        {coverUrl && (
                                            <img className="memoryboard-cover-image" src={coverUrl} alt="" />
                                        )}

                                        {!coverUrl && (
                                            <div className="memoryboard-cover-placeholder">
                                                <span>No Cover</span>
                                            </div>
                                        )}

                                        <button className="memoryboard-cover-menu-button" onClick={function (event) { toggleBoardMenuClick(event, memoryObject.id); }} type="button" >
                                            <span className="memoryboard-cover-menu-dots">•••</span>
                                        </button>
                                        {buildBoardCardMenu(memoryObject.id)}
                                    </div>
                                    <p className="memoryboard-cover-title">{memoryObject.titleText}</p>
                                </button>
                            );
                        })}
                    </div>
                    <input id="memoryboard-cover-file-input" type="file" accept="image/*" onChange={coverFileInputChange} style={{ display: "none" }} />
                    {buildDeletePopup()}
                </div>
            </main>
        );
    }

    function buildMainScreenContent() {
        if (memoryboardScreen === "templates") {
            return templateSelectionContent();
        }

        if (memoryboardScreen === "layout") {
            return buildLayoutScreenContent();
        }

        if (memoryboardScreen === "view") {
            return buildPreviewScreenContent();
        }

        return buildListScreenContent();
    }

    return (
        <div>
            <Header currentCircle={props.circleName || "Name Placeholder"} profileImage="#" />
            <div className="manage-layout">
                <Navbar activePage="memoryboard" />
                {buildMainScreenContent()}
                <ActivityFeed />
            </div>
        </div>
    );
}

export default MemoryBoard
