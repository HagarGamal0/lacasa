import React, { useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_BEHAVIOUR } from 'constants.js';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { settingsChangeColor } from 'settings/settingsSlice';
import IconMenuNotifications from './notifications/Notifications';
import SearchModal from './search/SearchModal';
import { menuChangeBehaviour } from './main-menu/menuSlice';

const NavIconMenu = () => {
  const { pinButtonEnable, behaviour } = useSelector((state) => state.menu);
  const { color } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const onPinButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pinButtonEnable) {
      dispatch(menuChangeBehaviour(behaviour === MENU_BEHAVIOUR.Pinned ? MENU_BEHAVIOUR.Unpinned : MENU_BEHAVIOUR.Pinned));
    }
    return false;
  };
  const onDisabledPinButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onLightDarkModeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(settingsChangeColor(color.includes('light') ? color.replace('light', 'dark') : color.replace('dark', 'light')));
  };
  const [showSearchModal, setShowSearchModal] = useState(false);

  const onSearchIconClick = (e) => {
    e.preventDefault();
    setShowSearchModal(true);
  };

  return (
    <>
   
      <SearchModal show={showSearchModal} setShow={setShowSearchModal} />
    </>
  );
};

export default React.memo(NavIconMenu);
