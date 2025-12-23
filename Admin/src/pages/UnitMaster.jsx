import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import { getUnits, createUnit, updateUnit, deleteUnit } from '../api';

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

const UnitMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [units, setUnits] = useState([]);
  const [modal, setModal] = useState({ type: null, unit: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const unitsData = await getUnits();
        setUnits(unitsData);
      } catch (err) {
        const errorMsg = `Failed to load units: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const openModal = (type, unit) => {
    setModal({ type, unit });
  };
  
  const closeModal = () => setModal({ type: null, unit: null });

  const handleAdd = async (unitData) => {
    try {
      const newUnit = await createUnit(unitData);
      setUnits([...units, newUnit]);
      toast.success('Unit added successfully!');
      closeModal();
    } catch (err) {
      toast.error(`Failed to add unit: ${err.message}`);
    }
  };

  const handleEdit = async (updatedUnit) => {
    try {
      await updateUnit(updatedUnit.id, updatedUnit);
      setUnits(units.map(u => u.id === updatedUnit.id ? { ...u, ...updatedUnit } : u));
      toast.success('Unit updated successfully!');
      closeModal();
    } catch (err) {
      toast.error(`Failed to update unit: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUnit(id);
      setUnits(units.filter(u => u.id !== id));
      toast.success('Unit deleted successfully!');
      closeModal();
    } catch (err) {
      toast.error(`Failed to delete unit: ${err.message}`);
    }
  };

  const ViewModal = ({ unit }) => (
    <div className="modal-content view-modal">
      <h2>Unit Details</h2>
      <div className="modal-product-info">
        <p><strong>Name:</strong> {unit.name}</p>
        <p><strong>Created:</strong> {new Date(unit.createdAt).toLocaleDateString('en-GB')}</p>
      </div>
    </div>
  );

  const AddModal = ({ onSave }) => {
    const [form, setForm] = useState({ name: '' });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        await onSave(form);
      } finally {
        setSaving(false);
      }
    };

    return (
      <form className="modal-content edit-modal" onSubmit={handleSubmit}>
        <h2>Add Unit</h2>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g., Piece, Kg, Liter"
            required
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={closeModal} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add Unit'}
          </button>
        </div>
      </form>
    );
  };

  const EditModal = ({ unit, onSave }) => {
    const [form, setForm] = useState({
      name: unit.name
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        await onSave({ ...unit, ...form });
      } finally {
        setSaving(false);
      }
    };

    return (
      <form className="modal-content edit-modal" onSubmit={handleSubmit}>
        <h2>Edit Unit</h2>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
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

  const DeleteModal = ({ unit, onDelete }) => (
    <div className="modal-content delete-modal">
      <h2>Delete Unit</h2>
      <p>Are you sure you want to delete <strong>{unit.name}</strong>?</p>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(unit.id)}>
          Delete
        </button>
      </div>
    </div>
  );

  const columns = [
    { key: 'name', label: 'Unit Name' },
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
    <div className="unit-master">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Units</h1>
          <p>Manage product units</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal('add', null)}
        >
          <Plus size={20} />
          Add Unit
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading units...</div>
      ) : (
        <>
          <DataTable
            data={units}
            columns={columns}
            searchTerm={searchTerm}
            searchKey="name"
          />

          <Modal open={modal.type === 'view'} onClose={closeModal}>
            {modal.unit && <ViewModal unit={modal.unit} />}
          </Modal>
          <Modal open={modal.type === 'add'} onClose={closeModal}>
            <AddModal onSave={handleAdd} />
          </Modal>
          <Modal open={modal.type === 'edit'} onClose={closeModal}>
            {modal.unit && <EditModal unit={modal.unit} onSave={handleEdit} />}
          </Modal>
          <Modal open={modal.type === 'delete'} onClose={closeModal}>
            {modal.unit && <DeleteModal unit={modal.unit} onDelete={handleDelete} />}
          </Modal>
        </>
      )}
    </div>
  );
};

export default UnitMaster;