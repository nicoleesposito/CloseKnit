import React, { useState } from 'react';
import './HelpButton.css';

// help content for each page (can be changed / added to in the future)
const helpContent = {
    //not added yet waiting on memory boardd page to be finalized
  memoryBoard: {
    title: 'Memory Board — Help Guide',
    items: [
      'Create Board: Tap the + button to start a new memory board and choose a layout.',
      'Your Boards: Existing boards will appear here with the cover image you selected.',
      'View or Edit: Select any board to open, update, or add new memories.'
    ]
  },
  //added & aligned
  journal: {
    title: 'Journal Page — Help Guide',
    items: [
      'Our Entries: View all past journal entries you\'ve created.' , 
      'Search Bar: Use the search field to quickly find a specific entry.',
      'New Entry: Tap New Entry to start writing a fresh journal entry.',
      'Edit Entry: Click on any entry to view, edit, or add more content.'
    ]
  },
  //added
  calendar: {
  title: 'Calendar Page — Help Guide',
  items: [
    'Current Circle: At the top, you\'ll see the circle you\'re currently viewing.',
    'Timeline: The bar to the left shows upcoming events. Each color matches an event type.',
    'Calendar View: Days with events show a color dot underneath.',
    'Month Navigation: Use the arrows at the top to move between months.',
    'Add Event: Tap the \'Add Event\' button to create a new event.'
  ]
}
};

const HelpButton = ({ page }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // get content for the current page/ safety and error handling for future chnages
  const content = helpContent[page];

  if (!content) {
    console.error(`No help content found for page: ${page}`);
    return null;
  }

  return (
    <>
      {/* help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="help-button"
        aria-label="Help"
      >
        <img 
          src="/images/ui/help.svg" 
          alt="Help" 
          width="24" 
          height="24"
        />
      </button>

      {/* the popup*/}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{content.title}</h2>
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <ul className="help-list">
              {content.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;