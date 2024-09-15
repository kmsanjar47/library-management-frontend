"use client";

import { AgGridReact } from "ag-grid-react";
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Quartz theme CSS
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import bookAtom from "@/atoms/book-atom";

export default function BookManagement() {
    const router = useRouter();
    const [bookAtomData, setBookAtom] = useAtom(bookAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch data from server
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/close/book', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    },
                });
                if (response.status === 200) {
                    toast.success('Books fetched successfully');
                    const result = await response.json();
                    setBookAtom(result);
                } else {
                    toast.error('Failed to fetch data');
                }
            } catch (error) {
                toast.error(error.message.toString());
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Define column definitions
    const colDefs: ColDef[] = [
        { headerName: 'ID', field: 'id', editable: false }, // ID shouldn't be editable
        { headerName: 'Title', field: 'title', editable: true }, // Editable field
        { headerName: 'Author', field: 'author', editable: true }, // Editable field
        { headerName: 'ISBN', field: 'isbn', editable: true }, // Editable field
        { headerName: 'Publisher', field: 'publisher', editable: true }, // Editable field
        { headerName: 'Published Date', field: 'published_date', editable: true }, // Editable field
        { headerName: 'Edition', field: 'edition', editable: true }, // Editable field
        { headerName: 'Number of Pages', field: 'number_of_pages', editable: true }, // Editable field
        { headerName: 'Language', field: 'language', editable: true }, // Editable field
        { headerName: 'Category', field: 'category', editable: true }, // Editable field
        {headerName:'Status',field:'status',editable:true},
        // {
        //     headerName: 'Book Cover',
        //     field: 'book_cover',
        //     cellRenderer: (params) => {
        //         return params.value ? `<img src="${params.value}" alt="Book Cover" style="width: 100px; height: auto;"/>` : 'No Cover';
        //     },
        // },
        { headerName: 'Created At', field: 'created_at', editable: false }, // Non-editable
        { headerName: 'Updated At', field: 'updated_at', editable: false }, // Non-editable
        {
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: (params) => (
                <Button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(params.data.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        filter: true,
        sortable: true,
    };

    // Function to handle deletion of a book
    const handleDelete = async (bookId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/close/book/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete book: ${response.status}`);
            }

            toast.success('Book deleted successfully');
            // Remove the deleted book from the grid
            setBookAtom((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        } catch (error) {
            toast.error(`Error deleting book: ${error.message}`);
        }
    };

    // Function to handle updates when a cell is changed
    const handleCellChange = async (event) => {
        const updatedData = event.data;
        //Remove the book cover from the updated data

        delete updatedData.book_cover
        try {
            const response = await fetch(`http://localhost:8000/api/v1/close/book/${updatedData.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedData), // Send only the updated data
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to update book: ${response.status}`);
            }

            toast.success('Book updated successfully');
        } catch (error) {
            toast.error(`Error updating book: ${error.message}`);
        }
    };

    return (
        <div className={'flex flex-col'}>
            <div className={"flex flex-row justify-between"}>
                <h1 className="text-3xl font-bold mb-7">Book Management</h1>
                {loading ? (
                    <ClipLoader
                        className={'flex justify-center'}
                        color={'#123abc'}
                        loading={loading}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                ) : (
                    <></>
                )}
                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        // Navigate to the create book page
                        router.push('/dashboard/admin/book/create');
                    }}
                >
                    Add Book
                </Button>
            </div>
            <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                <AgGridReact
                    rowData={bookAtomData}     // Row data from atom
                    columnDefs={colDefs}        // Column definitions with delete and editable fields
                    defaultColDef={defaultColDef} // Default column settings
                    onCellValueChanged={handleCellChange} // Handle cell changes
                />
            </div>
        </div>
    );
}
