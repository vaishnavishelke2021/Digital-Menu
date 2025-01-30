import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function ExploreMenus() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsRef = collection(db, 'restaurants');
        const snapshot = await getDocs(restaurantsRef);
        const restaurantList = [];
        snapshot.forEach((doc) => {
          restaurantList.push({ id: doc.id, ...doc.data() });
        });
        setRestaurants(restaurantList);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Explore Restaurants</h1>
        
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No restaurants available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Link 
                href={`/menu/${restaurant.id}`}
                key={restaurant.id}
                className="block transform transition duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{restaurant.name}</h2>
                    {restaurant.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
                    )}
                    <div className="space-y-2">
                      {restaurant.address && (
                        <p className="text-gray-600 flex items-center">
                          <span className="mr-2">📍</span> {restaurant.address}
                        </p>
                      )}
                      {restaurant.openingHours && (
                        <p className="text-gray-600 flex items-center">
                          <span className="mr-2">🕒</span> {restaurant.openingHours}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
