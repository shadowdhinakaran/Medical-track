import React, { useState } from 'react';
import AddMedicationForm from './AddMedicationForm';
import MedicationList from './AddMedicationList';

const MedicationPage = () => {
  const [refresh, setRefresh] = useState(false);

  const handleAdd = () => {
    setRefresh(!refresh); // triggers list update
  };

  return (
    <div>
      <AddMedicationForm onAdd={handleAdd} />
      <MedicationList refreshTrigger={refresh} />
    </div>
  );
};

export default MedicationPage;
