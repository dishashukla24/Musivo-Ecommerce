// Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiUser } from 'react-icons/fi';
import { AiOutlineShopping } from 'react-icons/ai';
import { Cart } from './';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/router';
import AuthModal from './AuthModal';
import { getProfile } from '../utils/getProfile';
import { logout } from '../utils/logout';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef();
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const router = useRouter();

  const handleSearch = () => {
    const q = search.trim();
    if (q) router.push(`/search?query=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    setUser(null);
    setDropdownVisible(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        if (res) {
          setUser(res);
          setShowAuthModal(false); 
        }
      } catch (err) {
        setUser(null);
      }
    };
  
    fetchUser();
  
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  return (
    <div className="navbar-container flex items-center justify-between px-6 py-4 shadow-md bg-white">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/assets/musivo.png"
            alt="Musivo Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="search-bar-container relative flex items-center w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='Search "Products"'
            className="search-input pr-12"
          />
          <button
            onClick={handleSearch}
            className="search-button"
          >
            <FiSearch className="text-white text-lg" />
          </button>
        </div>
      </div>

      {/*User*/}

      <div className="user-dropdown" ref={dropdownRef}>
  <button
    className="user-button"
    onClick={() => {
      if (user) {
        setDropdownVisible((prev) => !prev);
      } else {
        setShowAuthModal(true);
      }
    }}
  >
    <FiUser size={20} />
  </button>

  {user && dropdownVisible && (
    <div className="dropdown-menu ">
      <Link href="/profile" className="dropdown-item">Profile</Link>
      <button onClick={handleLogout} className="dropdown-item">Logout</button>
    </div>
  )}
</div>



      {/* Cart */}
      <button className="cart-icon relative ml-4" onClick={() => setShowCart(true)}>
        <AiOutlineShopping size={28} />
        <span className="cart-item-qty absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5">
          {totalQuantities}
        </span>
      </button>

      {/* Modals */}
      {showCart && <Cart />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} setUser={setUser} />}
    </div>
  );
};

export default Navbar;
