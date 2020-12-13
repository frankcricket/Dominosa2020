import React from 'react';


/**
 * React component for the Difficulty Selector.
 */
export const Difficulty = (props) => {
    let { difficulty } = "3x3";

    return (
        <div className="status__difficulty">
            <span className="status__difficulty-text">Difficulty:&nbsp;&nbsp;</span>
            <select name="status__difficulty-select" className="status__difficulty-select" defaultValue={difficulty} onChange={props.changeGrid}>
                <option value="3">3x3</option>
                <option value="4">4x4</option>
                <option value="5">5x5</option>
                <option value="6">6x6</option>
                <option value="7">7x7</option>
                <option value="8">8x8</option>
                <option value="9">9x9</option>
            </select>
        </div>
    )
}
export default Difficulty;