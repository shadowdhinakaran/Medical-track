import React, { useState } from 'react';
import supabase from '../supabaseClient';
import './AddMedicationForm.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  onAdd: () => void;
}

const AddMedicationForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [errors, setErrors] = useState<{ name?: string; dosage?: string; frequency?: string }>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!dosage.trim()) newErrors.dosage = 'Dosage is required.';
    if (!frequency.trim()) newErrors.frequency = 'Frequency is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrorMsg('');

    const newMed = { name, dosage, frequency, takenToday: false };
    const { error } = await supabase.from('medication_list').insert([newMed]);

    setLoading(false);

    if (error) {
      console.error('Insert error:', error.message);
      setErrorMsg('Failed to add medication. Please try again.');
    } else {
      setName('');
      setDosage('');
      setFrequency('');
      setErrors({});
      onAdd();
    }
  };

  const navigate = useNavigate();
  const handleNavigate = () => navigate('/PatientDashboard');

  return (
    <div className="med-form">
      <h2>Add Medication</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className={errors.dosage ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.dosage && <p className="error-msg">{errors.dosage}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={errors.frequency ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.frequency && <p className="error-msg">{errors.frequency}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Medication'}
        </button>
      </form>

      <p onClick={handleNavigate} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '20px' }}>
        Home
      </p>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </div>
  );
};

export default AddMedicationForm;


