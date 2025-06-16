import React from "react";
import "./AddMedicationList.css";
import { Check } from "lucide-react";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  takenToday: boolean;
}

interface AddMedicationListProps {
  medications: Medication[];
  toggleTaken: (med: Medication) => void;
}

const AddMedicationList: React.FC<AddMedicationListProps> = ({
  medications = [],
  toggleTaken,
}) => {
  return (
    <div className="med-list">
      <h3>Medication List</h3>
      <ul>
        {medications.length === 0 ? (
          <li>No medications available.</li>
        ) : (
          medications.map((med) => (
            <li key={med.id} className="med-item">
              <strong>{med.name}</strong> — {med.dosage} — {med.frequency}
              <br />
              <span style={{ color: med.takenToday ? "green" : "red" }}>
                {med.takenToday ? "Taken Today ✅" : "Not Taken ❌"}
              </span>
              {/*  <div className="action-buttons">
                <button onClick={() => toggleTaken(med)}>
                  {med.takenToday ? 'completed' : 'Mark as Taken'} 
                  
                </button>
              </div> */}
              <div className="action-buttons">
                <button
                  onClick={() => toggleTaken(med)}
                  disabled={med.takenToday}
                  style={{
                    backgroundColor: (med.takenToday && "#ccc") || "#4CAF50",
                    color: "white",
                    cursor: (med.takenToday && "not-allowed") || "pointer",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  {med.takenToday && "Completed"}
                  {!med.takenToday && "Mark as Taken"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AddMedicationList;
