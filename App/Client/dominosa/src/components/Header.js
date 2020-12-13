import React from 'react';

/**
 * React component for the Header Section.
 */
export const Header = (props) => {
    return (
        <header className="header">

            <h2 onClick={props.onClickNewGame}>
                New Game
      </h2>
        </header>
    )
}
export default Header;