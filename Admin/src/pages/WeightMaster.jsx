import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import { getWeights, createWeight, updateWeight, deleteWeight } from '../api';

// Modal component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

const WeightMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [weights, setWeights] = useState([]);
  const [modal, setModal] = useState({ type: null, weight: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        setLoading(true);
        const weightsData = await getWeights();
        setWeights(weightsData);
      } catch (err) {
        const errorMsg = `Failed to load weights: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchWeights();
  }, []);

  const openModal = (type, weight) => {
    setModal({ type, weight });
  };
  
  const closeModal = () => setModal({ type: null, weight: null });

  const handleAdd = async (weightData) => {
    try {
      const newWeight = await createWeight(weightData);
      setWeights([...weights, newWeight]);
      toast.success('Weight added successfully!');
      closeModal();
    } catch (err) {
      toast.error(`Failed to add weight: ${err.message}`);
    }
  };

  const handleEdit = async (updatedWeight) => {
    try {
      await updateWeight(updatedWeight.id, updatedWeight);
      setWeights(weights.map(w => w.id === updatedWeight.id ? { ...w, ...updatedWeight } : w));
      toast.success('Weight updated successfully!');
      closeModal();
    } catch (err) {
      toast.error(`Failed to update weight: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWeight(id);
      setWeights(weights.filter(w => w.id !== id));
      toast.success('Weight deleted successfully!');
      closeModal();
    } catch (err) {
      toast.error(`Failed to delete weight: ${err.message}`);
    }
  };

  const ViewModal = ({ weight }) => (
    <div className="modal-content view-modal">
      <h2>Weight Details</h2>
      <div className="modal-product-info">
        <p><strong>Value:</strong> {weight.value}</p>
        <p><strong>Unit:</strong> {weight.unit}</p>
        <p><strong>Display:</strong> {weight.value} {weight.unit}</p>
        <p><strong>Created:</strong> {new Date(weight.createdAt).toLocaleDateString('en-GB')}</p>
      </div>
    </div>
  );

  const AddModal = ({ onSave }) => {
    const [form, setForm] = useState({ value: '', unit: 'g' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        const weightData = {
          value: parseFloat(form.value),
          unit: form.unit
        };
        await onSave(weightData);
      } finally {
        setSaving(false);
      }
    };

    return (
      <form className="modal-content edit-modal" onSubmit={handleSubmit}>
        <h2>Add Weight</h2>
        <div className="form-group">
          <label className="form-label">Weight Value *</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={form.value}
            onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))}
            placeholder="e.g., 500, 1.5"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Unit *</label>
          <select
            className="form-select"
            value={form.unit}
            onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
            required
          >
            <option value="g">Grams (g)</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="ml">Milliliters (ml)</option>
            <option value="l">Liters (l)</option>
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={closeModal} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add Weight'}
          </button>
        </div>
      </form>
    );
  };

  const EditModal = ({ weight, onSave }) => {
    const [form, setForm] = useState({
      value: weight.value.toString(),
      unit: weight.unit
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        const weightData = {
          value: parseFloat(form.value),
          unit: form.unit
        };
        await onSave({ ...weight, ...weightData });
      } finally {
        setSaving(false);
      }
    };

    return (
      <form className="modal-content edit-modal" onSubmit={handleSubmit}>
        <h2>Edit Weight</h2>
        <div className="form-group">
          <label className="form-label">Weight Value *</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={form.value}
            onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Unit *</label>
          <select
            className="form-select"
            value={form.unit}
            onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
            required
          >
            <option value="g">Grams (g)</option>
            <option value="kg">Kilograms (kg)</option>
            <option value="ml">Milliliters (ml)</option>
            <option value="l">Liters (l)</option>
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={closeModal} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    );
  };

  const DeleteModal = ({ weight, onDelete }) => (
    <div className="modal-content delete-modal">
      <h2>Delete Weight</h2>
      <p>Are you sure you want to delete <strong>{weight.value} {weight.unit}</strong>?</p>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(weight.id)}>
          Delete
        </button>
      </div>
    </div>
  );

  const columns = [
    { key: 'value', label: 'Value' },
    { key: 'unit', label: 'Unit' },
    {
      key: 'display',
      label: 'Display',
      render: (_, row) => `${row.value} ${row.unit}`
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString('en-GB')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="action-btn view"
            title="View"
            onClick={() => openModal('view', row)}
          >
            <Eye size={16} />
          </button>
          <button
            className="action-btn edit"
            onClick={() => openModal('edit', row)}
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => openModal('delete', row)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="weight-master">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Weights</h1>
          <p>Manage product weights</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal('add', null)}
        >
          <Plus size={20} />
          Add Weight
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search weights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading weights...</div>
      ) : (
        <>
          <DataTable
            data={weights}
            columns={columns}
            searchTerm={searchTerm}
            searchKey="value"
          />

          <Modal open={modal.type === 'view'} onClose={closeModal}>
            {modal.weight && <ViewModal weight={modal.weight} />}
          </Modal>
          <Modal open={modal.type === 'add'} onClose={closeModal}>
            <AddModal onSave={handleAdd} />
          </Modal>
          <Modal open={modal.type === 'edit'} onClose={closeModal}>
            {modal.weight && <EditModal weight={modal.weight} onSave={handleEdit} />}
          </Modal>
          <Modal open={modal.type === 'delete'} onClose={closeModal}>
            {modal.weight && <DeleteModal weight={modal.weight} onDelete={handleDelete} />}
          </Modal>
        </>
      )}
    </div>
  );
};

export default WeightMaster;