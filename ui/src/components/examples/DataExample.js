import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks';

function DataExample() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const { fetchData, insertData, updateData, deleteData, loading, error } = useData();

  // Load items when component mounts
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetchData('items');
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItemName.trim()) return;
    
    try {
      const itemData = {
        name: newItemName,
        description: newItemDescription,
        created_at: new Date().toISOString()
      };
      
      const response = await insertData('items', itemData);
      
      if (response.success) {
        setItems([...items, response.data]);
        setNewItemName('');
        setNewItemDescription('');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    
    if (!editingItem || !editingItem.name.trim()) return;
    
    try {
      const response = await updateData(
        'items',
        'id',
        editingItem.id,
        {
          name: editingItem.name,
          description: editingItem.description
        }
      );
      
      if (response.success) {
        setItems(items.map(item => 
          item.id === editingItem.id ? response.data : item
        ));
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await deleteData('items', 'id', id);
      
      if (response.success) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Data Operations Example</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Add Item Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Add New Item</h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>
      
      {/* Edit Item Form */}
      {editingItem && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Edit Item</h2>
          <form onSubmit={handleUpdateItem} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="edit-name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="edit-description"
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows="3"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-green-600 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Items List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-medium p-6 border-b">Items List</h2>
        
        {loading && !items.length ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No items found. Add some items to see them here.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map(item => (
              <li key={item.id} className="p-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    )}
                    {item.created_at && (
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date(item.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DataExample; 