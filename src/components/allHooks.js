import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useReducer,
} from "react";

const Record = memo(({ record, onEdit, onDelete, onView }) => {
  return (
    <tr>
      <td>{record.name}</td>
      <td>
        <button onClick={() => onView(record)}>View</button>
        <button onClick={() => onEdit(record)}>Edit</button>
        <button onClick={() => onDelete(record)}>Delete</button>
      </td>
    </tr>
  );
});

const recordsReducer = (state, action) => {
  switch (action.type) {
    case "ADD_RECORD":
      return [...state, action.payload];
    case "UPDATE_RECORD":
      return state.map((record) =>
        record === action.payload.selectedRecord
          ? { ...record, ...action.payload.updatedRecord }
          : record
      );
    case "DELETE_RECORD":
      return state.filter((record) => record !== action.payload);
    default:
      return state;
  }
};

const Hooks = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [records, dispatch] = useReducer(recordsReducer, []);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem("records"));
    if (savedRecords) {
      dispatch({ type: "ADD_RECORD", payload: savedRecords });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedRecord) {
        dispatch({
          type: "UPDATE_RECORD",
          payload: { selectedRecord, updatedRecord: { name, email } },
        });
        setSelectedRecord(null);
      } else {
        dispatch({ type: "ADD_RECORD", payload: { name, email } });
      }
      setName("");
      setEmail("");
    },
    [name, email, selectedRecord]
  );

  const handleEdit = useCallback((record) => {
    setName(record.name);
    setEmail(record.email);
    setSelectedRecord(record);
  }, []);

  const handleDelete = useCallback((record) => {
    dispatch({ type: "DELETE_RECORD", payload: record });
  }, []);

  const handleView = useCallback((record) => {
    setSelectedRecord(record);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRecord(null);
  }, []);

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => a.name.localeCompare(b.name));
  }, [records]);

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
          {sortedRecords.map((record, index) => (
            <Record
              key={index}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
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

export default Hooks;
