import Logo from "../component/header_icon/logo";
import React from 'react';
import HeaderIcon from "../component/header_icon/header_icon";

interface HeaderProps {
  showAdditionalIcon: boolean;
}

const Header = ({ showAdditionalIcon }: HeaderProps) => {
  return (
    <header>
        <Logo/>
        { showAdditionalIcon && <HeaderIcon/>}
    </header>
  );
};

export default Header;
