import { useEffect, useState } from "react";
import api from "../api/axios";

function UserForm({
  users,
  setUsers,
  editingUser,
  setEditingUser,
  setShowForm,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.firstName.trim()) {
      tempErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      tempErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      tempErrors.email = "Invalid email";
    }

    if (!formData.department.trim()) {
      tempErrors.department = "Department is required";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      if (editingUser) {

  if (editingUser.id <= 10) {

    await api.put(`/users/${editingUser.id}`, formData);

  }

  const updatedUsers = users.map((user) =>
    user.id === editingUser.id
      ? {
          ...formData,
          id: editingUser.id,
        }
      : user
  );

  setUsers(updatedUsers);

}
       else {
        const response = await api.post("/users", formData);

        const newUser = {
          ...formData,
          id: response.data.id || users.length + 1,
        };

        setUsers([...users, newUser]);
      }

      setEditingUser(null);
      setShowForm(false);

    } catch (error) {
      alert("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>{editingUser ? "Edit User" : "Add User"}</h2>

        <form onSubmit={handleSubmit}>

          <label>First Name</label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          {errors.firstName && (
            <p className="error">{errors.firstName}</p>
          )}

          <label>Last Name</label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          {errors.lastName && (
            <p className="error">{errors.lastName}</p>
          )}

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <p className="error">{errors.email}</p>
          )}

          <label>Department</label>

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />

          {errors.department && (
            <p className="error">{errors.department}</p>
          )}

          <div className="modal-buttons">

            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingUser
                ? "Update"
                : "Save"}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setShowForm(false);
              }}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default UserForm;