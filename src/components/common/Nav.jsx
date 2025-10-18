import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import Logo from "../../assets/img/ic_logo.svg";
import Profile from "../../assets/img/img_profile.svg";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const toggleProfile = () => {
    setIsOpen((v) => !v);
  };

  return (
    <div className="Nav_wrap">
      <div className="container">
        <div className="nav_left">
          <div className="logo">
            <NavLink to="/" className="">
              <img src={Logo} alt="Logo" />
            </NavLink>
          </div>
        </div>
        <div className="nav_right">
          <div className="menu_button">
            <NavLink to="/bank" className="nav_bank">
              문제 은행
            </NavLink>
          </div>
          {/* isLoggedIn이 false일 때 NavLink to="/login"이 렌더링 됩니다. */}
          {isLoggedIn ? (
            <img
              className="nav_profile"
              src={Profile}
              onClick={toggleProfile}
              alt="profile"
            />
          ) : (
            // 이 부분은 이미 /login 경로로 연결되어 있습니다.
            <NavLink to="/login" className="nav_login">
              로그인
            </NavLink>
          )}
        </div>
      </div>
      <div className="toggle">
        {isLoggedIn && isOpen && <ProfileDropdown />}
      </div>
    </div>
  );
};

export default Nav;
