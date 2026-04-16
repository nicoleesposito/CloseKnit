import React, { useState, useEffect } from 'react';
import './HelpButton.css';
import { useLanguage } from '../../context/LanguageContext';

const HelpButton = ({ page }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(localStorage.getItem('darkMode') === 'true');

  // help content for each page, pulled from translations
  const helpContent = {
    memoryBoard: {
      title: t('help.memoryBoardTitle'),
      items: [
        t('help.memoryBoardItem1'),
        t('help.memoryBoardItem2'),
        t('help.memoryBoardItem3'),
      ]
    },
    journal: {
      title: t('help.journalTitle'),
      items: [
        t('help.journalItem1'),
        t('help.journalItem2'),
        t('help.journalItem3'),
        t('help.journalItem4'),
      ]
    },
    calendar: {
      title: t('help.calendarTitle'),
      items: [
        t('help.calendarItem1'),
        t('help.calendarItem2'),
        t('help.calendarItem3'),
        t('help.calendarItem4'),
        t('help.calendarItem5'),
      ]
    },
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark-mode'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  
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
          src={isDark ? "/images/ui/help-darktheme.svg" : "/images/ui/help.svg"}
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