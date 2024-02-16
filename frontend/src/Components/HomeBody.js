import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Home.css';

const FeatureCard = ({ title, description, linkTo }) => {
  return (
    <Link to={linkTo} className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

const HomeBody = () => {
  return (
    <div className="home-body">
      <FeatureCard
        title="Search Trains"
        description="Find and book trains for your journey."
        linkTo="/user/search"
      />
      <FeatureCard
        title="My Bookings"
        description="View and manage your booked trains."
        linkTo="/user/bookings"
      />
    </div>
  );
};

export default HomeBody;
