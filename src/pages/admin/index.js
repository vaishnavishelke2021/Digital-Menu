import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminPanel() {
  const [restaurants, setRestaurants] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRestaurants: 0,
    totalMenuItems: 0,
    viewsData: {
      labels: [],
      datasets: []
    }
  });

  useEffect(() => {
    fetchRestaurants();
    fetchAnalytics();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const restaurantsRef = collection(db, 'users');
      const querySnapshot = await getDocs(restaurantsRef);
      
      const restaurantsList = [];
      querySnapshot.forEach((doc) => {
        restaurantsList.push({ id: doc.id, ...doc.data() });
      });

      setRestaurants(restaurantsList);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // This is a placeholder for actual analytics data
      // In a real application, you would fetch this from your database
      const mockData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Menu Views',
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };

      setAnalytics({
        totalRestaurants: restaurants.length,
        totalMenuItems: 150, // This should be fetched from your database
        viewsData: mockData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Restaurants
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {analytics.totalRestaurants}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Menu Items
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {analytics.totalMenuItems}
                </dd>
              </div>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Menu Views Over Time</h2>
              <div className="h-64">
                <Line 
                  data={analytics.viewsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Restaurants List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Registered Restaurants</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {restaurants.map((restaurant) => (
                <li key={restaurant.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {restaurant.name || restaurant.email}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {restaurant.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
