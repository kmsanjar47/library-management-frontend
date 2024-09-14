"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'; // Import Recharts components
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// Sample data for the charts
const dataBooks = [
  { name: 'Jan', borrowed: 200 },
  { name: 'Feb', borrowed: 150 },
  { name: 'Mar', borrowed: 300 },
  { name: 'Apr', borrowed: 250 },
  { name: 'May', borrowed: 400 },
];

const dataRooms = [
  { name: 'Meeting Rooms', count: 15 },
  { name: 'Conference Rooms', count: 8 },
  { name: 'Workshop Rooms', count: 10 },
  { name: 'Event Rooms', count: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Pie chart colors

// Sample data for currently loaned books and rented rooms
const currentlyLoanedBooks = [
  { id: 1, title: "Book A", dueDate: "2024-09-30" },
  { id: 2, title: "Book B", dueDate: "2024-10-05" },
];

const currentlyRentedRooms = [
  { id: 1, roomType: "Meeting Room", startDate: "2024-09-20", endDate: "2024-09-21" },
  { id: 2, roomType: "Conference Room", startDate: "2024-09-25", endDate: "2024-09-26" },
];

export default function Dashboard() {
  const router = useRouter(); // Initialize useRouter for navigation

  // Logout function
  const handleLogout = () => {
    // Remove auth token and clear cookies
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    // Redirect to the login page
    router.push('/authentication'); // Redirect to login page or appropriate route
  };

  return (
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-gray-800 text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold">Library Dashboard</div>
            <div className="space-x-6">
              <Link href="/dashboard/" className="hover:text-gray-300 transition-colors">Home</Link>
              <Link href="/dashboard/book" className="hover:text-gray-300 transition-colors">Borrow a Book</Link>
              <Link href="/dashboard/room" className="hover:text-gray-300 transition-colors">Book a Room</Link>
              <button
                  onClick={handleLogout}
                  className="hover:text-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Key Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Total Books</h2>
              <div className="text-3xl font-bold text-gray-700">1,200</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Total Rooms</h2>
              <div className="text-3xl font-bold text-gray-700">38</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Total Users</h2>
              <div className="text-3xl font-bold text-gray-700">500</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Line Chart: Books Borrowed */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Books Borrowed Over Time</h2>
              <LineChart width={600} height={300} data={dataBooks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="borrowed" stroke="#8884d8" />
              </LineChart>
            </div>

            {/* Pie Chart: Room Types with Legend */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row items-center">
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Room Types</h2>
                <PieChart width={400} height={300}>
                  <Pie
                      data={dataRooms}
                      dataKey="count"
                      nameKey="name"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                  >
                    {dataRooms.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <div className="w-full md:w-1/3 mt-6 md:mt-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Types Legend</h3>
                <ul>
                  {dataRooms.map((entry, index) => (
                      <li key={`legend-${index}`} className="flex items-center mb-2">
                        <span className="block w-4 h-4 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="text-gray-700 font-medium">{entry.name}: {entry.count}</span>
                      </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Currently Loaned Books */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Currently Loaned Books</h2>
            {currentlyLoanedBooks.length > 0 ? (
                <ul>
                  {currentlyLoanedBooks.map((book) => (
                      <li key={book.id} className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                        <span className="text-gray-700 font-medium">{book.title}</span>
                        <span className="text-gray-500">Due: {book.dueDate}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-500">No books are currently loaned.</p>
            )}
          </div>

          {/* Currently Rented Rooms */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Currently Rented Rooms</h2>
            {currentlyRentedRooms.length > 0 ? (
                <ul>
                  {currentlyRentedRooms.map((room) => (
                      <li key={room.id} className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                        <span className="text-gray-700 font-medium">{room.roomType}</span>
                        <span className="text-gray-500">From {room.startDate} to {room.endDate}</span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-500">No rooms are currently rented.</p>
            )}
          </div>
        </div>
      </div>
  );
}
