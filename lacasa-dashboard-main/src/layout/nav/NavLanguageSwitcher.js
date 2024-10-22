import React, { useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { MENU_PLACEMENT } from 'constants.js';
import { changeLang } from 'lang/langSlice';
import { layoutShowingNavMenu } from 'layout/layoutSlice';

const MENU_NAME = 'NavLanguageSwitcher';
const NavLanguageSwitcher = () => {
  const dispatch = useDispatch();

  const {
    behaviourStatus: { behaviourHtmlData },
    placementStatus: { view: placement },
    attrMobile,
    attrMenuAnimate,
  } = useSelector((state) => state.menu);
  const { color } = useSelector((state) => state.settings);
  const { showingNavMenu } = useSelector((state) => state.layout);
  const { languages, currentLang } = useSelector((state) => state.lang);

  const onSelectLang = (code) => {
    dispatch(changeLang(code));
  };
  const onToggle = (status, event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
    dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
  };

  useEffect(() => {
    dispatch(layoutShowingNavMenu(''));
    // eslint-disable-next-line
  }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

  return (
    <>
    </>
  );
};
export default React.memo(NavLanguageSwitcher);
