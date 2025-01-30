import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { FaMapMarkerAlt, FaPhone, FaClock, FaUtensils } from 'react-icons/fa';

export default function MenuView() {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (!restaurantId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch restaurant info
        const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId));
        if (!restaurantDoc.exists()) {
          throw new Error('Restaurant not found');
        }
        setRestaurantInfo(restaurantDoc.data());

        // Fetch menu items
        const menuItemsRef = collection(db, 'menuItems');
        const q = query(menuItemsRef, where('restaurantId', '==', restaurantId));
        const querySnapshot = await getDocs(q);
        
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setMenuItems(items);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!restaurantInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold">{restaurantInfo.name}</h1>
            {restaurantInfo.description && (
              <p className="mt-4 text-lg text-black">{restaurantInfo.description}</p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
              {restaurantInfo.address && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{restaurantInfo.address}</span>
                </div>
              )}
              {restaurantInfo.phone && (
                <div className="flex items-center">
                  <FaPhone className="mr-2" />
                  <span>{restaurantInfo.phone}</span>
                </div>
              )}
              {restaurantInfo.openingHours && (
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>{restaurantInfo.openingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto py-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FaUtensils className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-500">No menu items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      {item.category && (
                        <p className="text-sm text-primary mt-1">{item.category}</p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                  </div>
                  {item.description && (
                    <p className="mt-3 text-gray-500 text-sm">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    
      
    </div>
  );
}
