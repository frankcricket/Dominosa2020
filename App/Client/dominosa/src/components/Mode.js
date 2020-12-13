import React from 'react';

/**
 * React component for the Mistakes Mode / Fast Mode
 * elements in the Status Section.
 */
export const Mode = (props) => {
    return (
        <div className="status__action-fast-mode">
            <label className="status__action-fast-mode-switch">
                <input type="checkbox" />
                <span className="status__action-fast-mode-slider"
                    onClick={props.onClickMode}
                ></span>
            </label>
            <p className="status__action-text">Web</p>
        </div>
    )
}
export default Mode;