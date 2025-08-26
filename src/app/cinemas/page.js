'use client';
import { FiEye, FiPlus, FiLoader, FiFrown } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { getRestaurentById } from '@/services/authSignupService';

export default function CinemaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await getRestaurentById(user.id);
        console.log('This is data', response.data)
        setCinemas(response.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch cinemas:', err);
        setError('Failed to load cinema data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchCinemas();
    }
  }, [user?.id]);

  // const handleView = (cinemaId) => {
  //   router.push(`/cinemas-profile?id=${cinemaId}`);
  // };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Cinemas Directory</h2>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Loading...' : `Showing ${cinemas.length} cinemas`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <div className="mx-auto h-12 w-12 text-red-400 mb-4">
              <FiFrown className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              Try Again
            </button>
          </div>
        ) : cinemas.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <FiPlus className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No cinemas found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-gray-600 font-medium">S.No</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">Cinema Name</th>
                  <th className="px-4 py-3 text-gray-600 font-medium">Location</th>
                  {/* <th className="px-4 py-3 text-gray-600 font-medium">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {cinemas?.map((cinema, index) => (
                  <tr key={cinema.id}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{cinema?.restaurantName}</td>
                    <td className="px-4 py-3">{cinema?.Location}</td>
                    {/* <td className="px-4 py-3">
                      <button
                        onClick={() => handleView(cinema.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      >
                        <FiEye className="mr-1.5" />
                        View
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}