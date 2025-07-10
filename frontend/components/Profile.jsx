import React, { useEffect, useState } from 'react';
import { getProfile } from '../utils/getProfile';
import { logout } from '../utils/logout';
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';

const Profile = () => {
  const { user, setUser } = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setUser(res);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Please login first');
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    setUser(null);
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-card">
          <h2 className="profile-heading">👤 My Profile</h2>
          <p><span className="label">Name:</span> {user.name}</p>
          <p><span className="label">Email:</span> {user.email}</p>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p className="text-center">Not logged in</p>
      )}
    </div>
  );
};

export default Profile;
