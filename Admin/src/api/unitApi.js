import API_BASE_URL from './config';

export const getUnits = async () => {
  const response = await fetch(`${API_BASE_URL}/units`);
  if (!response.ok) throw new Error('Failed to fetch units');
  return response.json();
};

export const createUnit = async (unitData) => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/units`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(unitData)
  });
  if (!response.ok) throw new Error('Failed to create unit');
  return response.json();
};

export const updateUnit = async (id, unitData) => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/units/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(unitData)
  });
  if (!response.ok) throw new Error('Failed to update unit');
  return response.json();
};

export const deleteUnit = async (id) => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/units/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete unit');
  return response.json();
};