import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import axios from 'axios';
import './Stas.css'; // Import CSS file

const IngredientStats = () => {
  const [ingredientData, setIngredientData] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [averageActivityTime, setAverageActivityTime] = useState([]);
  const [updatedProfiles, setUpdatedProfiles] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("token"));


  useEffect(() => {
    if (!token) {
      console.error('Token not found. Please log in.');
      return;
    }

    const fetchData = async () => {
      try {
        const [ingredientsRes, usersRes, monthlyRegRes, activityTimeRes, updatedProfilesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/ingredients/stats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/api/users/stats", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/api/users/monthly-registrations", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/api/users/average-activity-time", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://127.0.0.1:8000/api/users/recently-updated-profiles", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setIngredientData(ingredientsRes.data);
        setActiveUsers(usersRes.data.active);
        setInactiveUsers(usersRes.data.inactive);
        setUserStats(monthlyRegRes.data);

        if (activityTimeRes.data.average_time) {
          const timeData = Array.from({ length: 12 }, (_, i) => ({
            name: new Date(2025, i).toLocaleString('en-US', { month: 'long' }),
            average_time: activityTimeRes.data.average_time
          }));
          setAverageActivityTime(timeData);
        }

        setUpdatedProfiles(updatedProfilesRes.data.updated_profiles || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error loading statistics:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-cards">
        <div className="stat-card active-user-card">
          <h2 className="stat-title">Active Users</h2>
          <p className="stat-number">{activeUsers}</p>
        </div>
        <div className="stat-card inactive-user-card">
          <h2 className="stat-title">Inactive Users</h2>
          <p className="stat-number">{inactiveUsers}</p>
        </div>
      </div>

      <div className="graph-cards">
       

        <div className="stat-card">
          <h2>User Registrations per Month</h2>
          <ResponsiveContainer height={300}>
            <PieChart>
              <Pie data={userStats} dataKey="count" nameKey="month" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
                {userStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h2>Average User Activity Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={averageActivityTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average_time" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h2>Recently Updated Profiles</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: 'Updated Profiles', count: updatedProfiles }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IngredientStats;
