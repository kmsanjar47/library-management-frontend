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
import authorAtom from "@/atoms/author-atom";
import { useAtom } from "jotai";

export default function AuthorManagement() {
    const router = useRouter();
    const [authorAtomData, setAuthor] = useAtom(authorAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch data from server
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/close/author', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    },
                });
                if (response.status === 200) {
                    toast.success('Authors fetched successfully');
                    const result = await response.json();
                    setAuthor(result);
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

    // Define column definitions and add a delete button
    const colDefs: ColDef[] = [
        { headerName: 'ID', field: 'id', editable: false }, // ID shouldn't be editable
        { headerName: 'Name', field: 'name', editable: true }, // Editable field
        { headerName: 'Email', field: 'email', editable: true }, // Editable field
        { headerName: 'Date of Birth', field: 'date_of_birth', editable: true }, // Editable field
        { headerName: 'Created At', field: 'created_at', editable: false },
        { headerName: 'Updated At', field: 'updated_at', editable: false },
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

    // Function to handle the deletion of an author
    const handleDelete = async (authorId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/close/author/${authorId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete author: ${response.status}`);
            }

            toast.success('Author deleted successfully');
            // Remove the deleted author from the grid
            setAuthor((prevAuthors) => prevAuthors.filter((author) => author.id !== authorId));
        } catch (error) {
            toast.error(`Error deleting author: ${error.message}`);
        }
    };

    // Function to handle updates when a cell is changed
    const handleCellChange = async (event) => {
        const updatedData = event.data;

        try {
            const response = await fetch(`http://localhost:8000/api/v1/close/author/${updatedData.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedData), // Send only the updated data
                headers: {
                    'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to update author: ${response.status}`);
            }

            toast.success('Author updated successfully');
        } catch (error) {
            toast.error(`Error updating author: ${error.message}`);
        }
    };

    return (
        <div className={'flex flex-col'}>
            <div className={"flex flex-row justify-between"}>
                <h1 className="text-3xl font-bold mb-7">Author Management</h1>
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
                        // Navigate to the create author page
                        router.push('/dashboard/admin/author/create');
                    }}
                >
                    Add Author
                </Button>
            </div>
            <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                <AgGridReact
                    rowData={authorAtomData}     // Row data from atom
                    columnDefs={colDefs}          // Column definitions with delete and editable fields
                    defaultColDef={defaultColDef} // Default column settings
                    onCellValueChanged={handleCellChange} // Handle cell changes
                />
            </div>
        </div>
    );
}
