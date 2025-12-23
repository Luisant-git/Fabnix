import API_BASE_URL from './config';

export const getWeights = async () => {
  const response = await fetch(`${API_BASE_URL}/weights`);
  if (!response.ok) throw new Error('Failed to fetch weights');
  return response.json();
};

export const createWeight = async (weightData) => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/weights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(weightData)
  });
  if (!response.ok) throw new Error('Failed to create weight');
  return response.json();
};

export const updateWeight = async (id, weightData) => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/weights/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(weightData)
  });
  if (!response.ok) throw new Error('Failed to update weight');
  return response.json();
};

export const deleteWeight = async (id) => {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(`${API_BASE_URL}/weights/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete weight');
  return response.json();
};