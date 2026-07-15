import { useState } from "react";

function FilterModal({
    setFilters,
    setShowFilter,
}) {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const applyFilters = () => {
        setFilters(formData);
        setShowFilter(false);
    };

    const clearFilters = () => {
        const empty = {
            firstName: "",
            lastName: "",
            email: "",
            department: "",
        };

        setFormData(empty);
        setFilters(empty);
        setShowFilter(false);
    };

    return (
        <div className="modal-overlay">

            <div className="modal">

                <h2>Filter Users</h2>

                <label>First Name</label>

                <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />

                <label>Last Name</label>

                <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />

                <label>Email</label>

                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <label>Department</label>

                <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                />

                <div className="modal-buttons">

                    <button
                        onClick={applyFilters}
                    >
                        Apply
                    </button>

                    <button
                        onClick={clearFilters}
                    >
                        Clear
                    </button>

                </div>

            </div>

        </div>
    );
}

export default FilterModal;