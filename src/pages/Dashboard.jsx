import FilterModal from "../components/FilterModal";
import Pagination from "../components/Pagination";
import UserForm from "../components/UserForm";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import api from "../api/axios";
import UserTable from "../components/UserTable";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [showFilter, setShowFilter] = useState(false);

const [filters, setFilters] = useState({
  firstName: "",
  lastName: "",
  email: "",
  department: "",
});

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");

      const formattedUsers = response.data.map((user) => {
        const names = user.name.split(" ");

      
        return {
          id: user.id,
          firstName: names[0],
          lastName: names.slice(1).join(" "),
          email: user.email,
          department: user.company.name,
        };
      });

      setUsers(formattedUsers);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

const filteredUsers = users.filter((user) => {

  const search = searchTerm.toLowerCase();

  const searchMatch =
    user.firstName.toLowerCase().includes(search) ||
    user.lastName.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    user.department.toLowerCase().includes(search);

  const filterMatch =
    user.firstName
      .toLowerCase()
      .includes(filters.firstName.toLowerCase()) &&

    user.lastName
      .toLowerCase()
      .includes(filters.lastName.toLowerCase()) &&

    user.email
      .toLowerCase()
      .includes(filters.email.toLowerCase()) &&

    user.department
      .toLowerCase()
      .includes(filters.department.toLowerCase());

  return searchMatch && filterMatch;

});

const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;

const sortedUsers = [...filteredUsers];

if (sortBy === "firstName") {
  sortedUsers.sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );
}

if (sortBy === "lastName") {
  sortedUsers.sort((a, b) =>
    a.lastName.localeCompare(b.lastName)
  );
}

if (sortBy === "department") {
  sortedUsers.sort((a, b) =>
    a.department.localeCompare(b.department)
  );
}

const displayedUsers = sortedUsers.slice(
  indexOfFirstUser,
  indexOfLastUser
);

const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

const handleEdit = (user) => {
  setEditingUser(user);
  setShowForm(true);
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    if (id <= 10) {
      await api.delete(`/users/${id}`);
    }

    const updatedUsers = users.filter((user) => user.id !== id);

    setUsers(updatedUsers);
    const maxPage = Math.ceil(updatedUsers.length / usersPerPage);

if (currentPage > maxPage && maxPage > 0) {
  setCurrentPage(maxPage);
}

    alert("User deleted successfully.");

  } catch (error) {
    console.error(error);
    alert("Unable to delete user.");
  }
};
const handleAddUser = () => {
  setEditingUser(null);
  setShowForm(true);
};
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Users</h2>

<div className="header-actions">
  <SearchBar
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
  />

  <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="sort-select"
>
  <option value="">Sort By</option>
  <option value="firstName">First Name</option>
  <option value="lastName">Last Name</option>
  <option value="department">Department</option>
</select>

 <button onClick={() => setShowFilter(true)}>
  Filter
</button>

  <button onClick={handleAddUser}>
  Add User
</button>
</div>
      </div>

      {loading && <h3>Loading users...</h3>}

      {error && <h3>{error}</h3>}

      {!loading && !error && (
        <UserTable
  users={displayedUsers}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
    
      )}
      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  setCurrentPage={setCurrentPage}
  usersPerPage={usersPerPage}
  setUsersPerPage={setUsersPerPage}
/>

      {showForm && (
  <UserForm
    users={users}
    setUsers={setUsers}
    editingUser={editingUser}
    setEditingUser={setEditingUser}
    setShowForm={setShowForm}
  />
)}
    {showFilter && (

<FilterModal

setFilters={setFilters}

setShowFilter={setShowFilter}

/>

)}
    </div>
  );
}

export default Dashboard;