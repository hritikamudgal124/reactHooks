import React, { useState } from "react";

const Details = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRecord) {
      const updatedRecord = { ...selectedRecord, name, email };
      const updatedRecords = records.map((record) =>
        record === selectedRecord ? updatedRecord : record
      );
      setRecords(updatedRecords);
      setSelectedRecord(null);
    } else {
      const newRecord = { name, email };
      setRecords([...records, newRecord]);
    }
    setName("");
    setEmail("");
  };

  const handleEdit = (record) => {
    setName(record.name);
    setEmail(record.email);
    setSelectedRecord(record);
  };

  const handleDelete = (record) => {
    setRecords(records.filter((rec) => rec !== record));
  };

  const handleView = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  return (
    <div>
      <h1>Records</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">
          {selectedRecord ? "Update" : "Add Record"}
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index}>
              <td>{record.name}</td>
              <td>
                <button onClick={() => handleView(record)}>View</button>
                <button onClick={() => handleEdit(record)}>Edit</button>
                <button onClick={() => handleDelete(record)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRecord && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Record Details</h2>
            <p>Name: {selectedRecord.name}</p>
            <p>Email: {selectedRecord.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
