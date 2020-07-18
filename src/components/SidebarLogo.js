import React from 'react';
import {
  WEBSITE_NAME
} from '../constants';
import logo from '../assets/images/logo.png';

const SidebarLogo = ({theme}) => {
  return (
    <div className="sidebar-logo">
      < img style = {
        {
          backgroundColor: `${(theme==='dark')?'transparent':'#000'}`
        }
      }
      src = {
        logo
      }
      alt = "..." / >
      <h2 style={{color:`${(theme==='dark')?'#fff':'#000'}`}} className="sidebar-logo-content">{WEBSITE_NAME}</h2>
    </div>
  )
}

export default SidebarLogo
