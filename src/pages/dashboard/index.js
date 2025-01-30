import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import QRCode from 'qrcode';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: ''
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchMenuItems(),
        fetchRestaurantInfo(),
        checkExistingQR()
      ]).finally(() => setIsLoading(false));
    }
  }, [user]);

  const fetchMenuItems = async () => {
    if (!user) return;
    try {
      const menuItemsRef = collection(db, 'menuItems');
      const q = query(menuItemsRef, where('restaurantId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchRestaurantInfo = async () => {
    if (!user) return;
    try {
      const restaurantDoc = await getDoc(doc(db, 'restaurants', user.uid));
      if (restaurantDoc.exists()) {
        setRestaurantInfo(restaurantDoc.data());
      }
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
    }
  };

  const checkExistingQR = async () => {
    if (!user) return;
    try {
      const restaurantDoc = await getDoc(doc(db, 'restaurants', user.uid));
      if (restaurantDoc.exists() && restaurantDoc.data().qrCodeUrl) {
        setQrCodeUrl(restaurantDoc.data().qrCodeUrl);
      }
    } catch (error) {
      console.error('Error checking QR code:', error);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const menuItemRef = collection(db, 'menuItems');
      await addDoc(menuItemRef, {
        ...newItem,
        restaurantId: user.uid,
        createdAt: new Date().toISOString()
      });

      setNewItem({
        name: '',
        description: '',
        price: '',
        category: ''
      });

      await fetchMenuItems();
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    if (!editingItem || !user) return;

    try {
      await setDoc(doc(db, 'menuItems', editingItem.id), {
        ...editingItem,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setEditingItem(null);
      await fetchMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
      await fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleRestaurantInfoUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, 'restaurants', user.uid), {
        ...restaurantInfo,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      alert('Restaurant information updated successfully!');
    } catch (error) {
      console.error('Error updating restaurant info:', error);
      alert('Failed to update restaurant information');
    }
  };

  const generateQRCode = async () => {
    if (!user) return;
    
    try {
      const menuUrl = `${window.location.origin}/menu/${user.uid}`;
      const qrCode = await QRCode.toDataURL(menuUrl);
      await setDoc(doc(db, 'restaurants', user.uid), { 
        qrCodeUrl: qrCode,
        menuUrl
      }, { merge: true });
      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('menu')}
                className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
              >
                Menu Management
              </button>
              <button
                onClick={() => setActiveTab('restaurant')}
                className={`tab ${activeTab === 'restaurant' ? 'active' : ''}`}
              >
                Restaurant Info
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`tab ${activeTab === 'qr' ? 'active' : ''}`}
              >
                QR Code
              </button>
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'menu' && (
              <div>
                <form onSubmit={editingItem ? handleUpdateMenuItem : handleAddMenuItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Item Name</label>
                    <input
                      type="text"
                      value={editingItem ? editingItem.name : newItem.name}
                      onChange={(e) => editingItem 
                        ? setEditingItem({...editingItem, name: e.target.value})
                        : setNewItem({...newItem, name: e.target.value})
                      }
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingItem ? editingItem.description : newItem.description}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, description: e.target.value})
                        : setNewItem({...newItem, description: e.target.value})
                      }
                      className="input"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingItem ? editingItem.price : newItem.price}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, price: e.target.value})
                        : setNewItem({...newItem, price: e.target.value})
                      }
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      value={editingItem ? editingItem.category : newItem.category}
                      onChange={(e) => editingItem
                        ? setEditingItem({...editingItem, category: e.target.value})
                        : setNewItem({...newItem, category: e.target.value})
                      }
                      className="input"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    {editingItem && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setNewItem({
                            name: '',
                            description: '',
                            price: '',
                            category: ''
                          });
                        }}
                        className="btn-secondary"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900">Menu Items</h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="relative bg-white rounded-lg shadow-sm p-4"
                      >
                        <div className="absolute top-2 right-2 space-x-2 z-10">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                          <p className="mt-2 text-lg font-medium text-gray-900">₹{item.price}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'restaurant' && (
              <form onSubmit={handleRestaurantInfoUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                  <input
                    type="text"
                    value={restaurantInfo.name}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
                    className="input"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={restaurantInfo.phone}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={restaurantInfo.email}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                  <textarea
                    value={restaurantInfo.openingHours}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, openingHours: e.target.value})}
                    className="input"
                    rows={2}
                    placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={restaurantInfo.description}
                    onChange={(e) => setRestaurantInfo({...restaurantInfo, description: e.target.value})}
                    className="input"
                    rows={3}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Save Restaurant Info
                </button>
              </form>
            )}

            {activeTab === 'qr' && (
              <div className="text-center">
                <button
                  onClick={generateQRCode}
                  className="btn-primary"
                >
                  Generate QR Code
                </button>
                {qrCodeUrl && (
                  <div className="mt-4">
                    <img src={qrCodeUrl} alt="Menu QR Code" className="mx-auto" />
                    <a
                      href={qrCodeUrl}
                      download="menu-qr-code.png"
                      className="mt-4 btn-secondary inline-block"
                    >
                      Download QR Code
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
