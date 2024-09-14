"use client";
import React, { useEffect, useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import RoomPic from "/lib/assets/book-cover-1.jpg"; // Use an image related to rooms
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {useRouter} from "next/navigation";

export default function Dashboard() {
    const [rooms, setRooms] = useState([]); // Initialize as an empty array
    const [open, setOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const router = useRouter(); // Initialize useRouter for navigation

    // Logout function
    const handleLogout = () => {
        // Remove auth token and clear cookies
        localStorage.removeItem('authToken');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

        // Redirect to the login page
        router.push('/authentication'); // Redirect to login page or appropriate route
    };


    // Fetch rooms from the API
    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/close/room',{
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRooms(data);
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
                setRooms([]); // Ensure rooms is set to an empty array on error
            }
        }

        fetchRooms();
    }, []);

    // Handle dialog open
    const handleOpenDialog = (room) => {
        setSelectedRoom(room);
        setOpen(true);
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedRoom(null);
    };

    // Handle room booking
    const handleRentRoom = async () => {
        if (!selectedRoom) return;

        // Retrieve user ID from local storage
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            alert('User not logged in');
            handleCloseDialog();
            return;
        }

        // Make API request to book the room
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/close/room/book_room?id=${selectedRoom.id}&user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',}
            });
            if (response.ok) {
                alert(`Successfully booked `);
            } else {
                alert('Error booking room');
            }
        } catch (error) {
            console.error('Error booking room:', error);
        }

        handleCloseDialog();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-gray-800 text-white py-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold">Library Dashboard</div>
                    <div className="space-x-6">
                        <Link href="/dashboard/" className="hover:text-gray-300 transition-colors">Home</Link>
                        <Link href="/dashboard/book" className="hover:text-gray-300 transition-colors">Borrow a
                            Book</Link>
                        <Link href="/dashboard/room" className="hover:text-gray-300 transition-colors">Book a
                            Room</Link>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Room Cards */}
                    {rooms.map((room) => (
                        <Card key={room.id} className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                            <div className="relative w-full h-[300px]">
                                <Image src={room.room_image || RoomPic} alt="room-pic" layout="fill" objectFit="cover" className="absolute inset-0" onClick={() => handleOpenDialog(room)} />
                            </div>
                            <CardFooter className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-4 flex justify-between items-center border-t border-gray-200">
                                <div className="font-semibold text-gray-800">{room.name}</div>
                                <div className={`p-1.5 text-sm font-medium ${room.status === 'available' ? 'bg-green-500' : room.status === 'booked'?'bg-amber-200':'bg-red-500'} text-white rounded-full`}>
                                    {room.status === 'available' ? 'Available' : room.status === 'booked'?'Booked':'Unavailable'}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Dialog */}
                {selectedRoom && (
                    <Dialog open={open} onOpenChange={handleCloseDialog}>
                        <DialogTrigger asChild>
                            <span className="hidden">Open Dialog</span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedRoom.name}</DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                                <div className="relative w-full h-[300px]">
                                    <Image src={selectedRoom.room_image || RoomPic} alt="room-pic" layout="fill" objectFit="contain" className="absolute inset-0" />
                                </div>
                                <div className="mt-4">
                                    <p><strong>Description:</strong> {selectedRoom.description}</p>
                                    <p><strong>Status:</strong> {selectedRoom.status === 'available' ? 'Available' : 'Unavailable'}</p>
                                    <p><strong>Capacity:</strong> {selectedRoom.capacity}</p>
                                    <p><strong>Room Type:</strong> {selectedRoom.room_type}</p>
                                    <p><strong>Booked Date:</strong> {selectedRoom.booked_date}</p>
                                    <p><strong>Booked Time:</strong> {selectedRoom.booked_time}</p>
                                    <p><strong>Next Available Slot:</strong> {selectedRoom.next_available_slot}</p>
                                </div>
                            </div>
                            <div className="p-4 flex justify-end gap-4">
                                {selectedRoom.status === 'available' && (
                                    <button
                                        onClick={handleRentRoom}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Rent Room
                                    </button>
                                )}
                                <button
                                    onClick={handleCloseDialog}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
