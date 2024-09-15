"use client";
import { useEffect, useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import BookCoverPic from "/lib/assets/book-cover-1.jpg";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [open, setOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [books, setBooks] = useState([]);
    const router = useRouter();

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        router.push('/authentication');
    };

    // Fetch books from the API
    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/close/book',{
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setBooks(data);
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
            }
        }

        fetchBooks();
    }, []);

    const handleOpenDialog = (book) => {
        setSelectedBook(book);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedBook(null);
    };

    const handleBorrowBook = async () => {
        if (!selectedBook) return;

        const userId = localStorage.getItem('user_id');
        if (!userId) {
            alert('User not logged in');
            handleCloseDialog();
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/close/loan/loan_book?id=${selectedBook.id}&user_id=${userId}`, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                },
                method: 'POST',
            });
            if (response.ok) {
                alert(`Successfully borrowed ${selectedBook.title}`);
            } else {
                console.log(response);
                alert('Book borrowing failed');
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* Book Cards */}
                    {books.map((book) => (
                        <Card key={book.id} className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
                            <div className="relative w-full h-[300px]">
                                <Image
                                    src={book.book_cover || BookCoverPic}
                                    alt="book-cover"
                                    layout="fill"
                                    objectFit="cover"
                                    className="absolute inset-0"
                                    onClick={() => handleOpenDialog(book)}
                                />
                            </div>
                            <CardFooter className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-4 flex justify-between items-center border-t border-gray-200">
                                <div className="font-semibold text-gray-800">{book.title}</div>
                                <div className={`p-1.5 text-sm font-medium ${book.status === 'available' ? 'bg-green-500' : book.status === 'issued'? 'bg-amber-300':'bg-red-500'} text-white rounded-full`}>
                                    {book.status === 'available' ? 'Available' : book.status === 'unavailable'?'Unavailable':book.status === 'issued'?'Issued':book.status.toString()}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Dialog */}
                {selectedBook && (
                    <Dialog open={open} onOpenChange={handleCloseDialog}>
                        <DialogTrigger asChild>
                            <span className="hidden">Open Dialog</span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedBook.title}</DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                                <div className="relative w-full h-[300px]">
                                    <Image
                                        src={selectedBook.book_cover || BookCoverPic}
                                        alt="book-cover"
                                        layout="fill"
                                        objectFit="contain"
                                        className="absolute inset-0"
                                    />
                                </div>
                                <div className="mt-4">
                                    <p><strong>Description:</strong> {selectedBook.description || 'No description available'}</p>
                                    <p><strong>Status:</strong> {selectedBook.status === 'available' ? 'Available' : 'Unavailable'}</p>
                                    <p><strong>Author:</strong> {selectedBook.author || 'Unknown'}</p>
                                    <p><strong>ISBN:</strong> {selectedBook.isbn || 'Not available'}</p>
                                    <p><strong>Published Date:</strong> {selectedBook.published_date ? new Date(selectedBook.published_date).toDateString() : 'Not available'}</p>
                                    <p><strong>Edition:</strong> {selectedBook.edition || 'Not available'}</p>
                                    <p><strong>Language:</strong> {selectedBook.language || 'Not available'}</p>
                                    <p><strong>Number of Pages:</strong> {selectedBook.number_of_pages || 'Not available'}</p>
                                </div>
                            </div>
                            <div className="p-4 flex justify-end gap-4">
                                {selectedBook.status === 'available' && (
                                    <button
                                        onClick={handleBorrowBook}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Borrow Book
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
