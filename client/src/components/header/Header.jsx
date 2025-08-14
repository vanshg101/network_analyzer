import React from "react";
import { NavLink } from "react-router-dom";
// import { useSelector } from 'react-redux';

function Header() {
  // const expence=useSelector((state)=>state.expence)

  return (
    <>
      {/* <AddExpence /> */}
      <div>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              home{" "}
            </NavLink>
          </li>
          {/* <li>
            {" "}
            <NavLink
              to="/spendamt"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              Spend 
            </NavLink>
          </li> */}
          <li>
            {" "}
            <NavLink
              to="/map"
              className={({ isActive }) =>
                `block py-2 pr-4 pl-3 duration-200 ${
                  isActive ? "text-orange-700" : "text-gray-700"
                } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
              }
            >
              Map
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;
