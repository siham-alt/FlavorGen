import { useState, useEffect } from "react";
import axios from "axios";
import "./adUsers.css"; // Import the CSS file

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setUsers(response.data))
    .catch(error => console.error("Loading error:", error));
  }, []);

  const handleSearch = () => {
    axios.get(`http://127.0.0.1:8000/api/users/search?q=${search}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log("API Response:", response.data);
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    })
    .catch(error => {
      console.error("Search error:", error);
      setUsers([]);
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => setUsers(users.filter(user => user.id !== id)))
    .catch(error => console.error("Deletion error:", error));
  };

  return (
    <div className="users-container">
      <h1 className="users-title">User Management</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name/email..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.last_activity ?? "No activity"}</td>
                  <td className={user.statut === "Actif" ? "status-active" : "status-inactive"}>
                    {user.statut}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id)} className="deletee-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-users">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
