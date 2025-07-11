import React, { useEffect, useState } from 'react';
import { getProfile } from '../../utils/getProfile';
import toast from 'react-hot-toast';
import { logout } from '../../utils/logout';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile()
      .then(setUser)
      .catch(() => toast.error('Please login first'));
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    setUser(null);
  };

  if (!user) return <p className="profile-container">Not logged in</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      <p className="profile-text"><strong>Name:</strong> {user.name}</p>
      <p className="profile-text"><strong>Email:</strong> {user.email}</p>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;