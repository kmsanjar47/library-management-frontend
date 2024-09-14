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

export default function LoanManagement() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        // Fetch data from server
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/close/loan', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`, // Add the token to the Authorization header
                    },
                });
                if (response.status === 200) {
                    toast.success('Loans fetched successfully');
                    const result = await response.json();
                    setRowData(result);
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

    // Handle delete action
    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this loan?")) {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/v1/close/loan/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    },
                });
                if (response.status === 204) {
                    toast.success('Loan deleted successfully');
                    setRowData(rowData.filter((loan: any) => loan.id !== id)); // Remove the deleted item from the state
                } else {
                    toast.error('Failed to delete loan');
                }
            } catch (error) {
                toast.error(error.message.toString());
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle update action (Navigate to the update page)
    const handleUpdate = (id: number) => {
        router.push(`/dashboard/admin/loan/update/${id}`);
    };

    // Handle cell value change for inline editing
    const handleCellChange = async (event: any) => {
        const updatedData = event.data;

        try {
            const response = await fetch(`http://localhost:8000/api/v1/close/loan/${updatedData.id}`, {
                method: 'PATCH',
                body: JSON.stringify(updatedData), // Send updated data
                headers: {
                    'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to update loan: ${response.status}`);
            }

            toast.success('Loan updated successfully');
        } catch (error) {
            toast.error(`Error updating loan: ${error.message}`);
        }
    };

    // Add action buttons (Delete & Update) and make relevant fields editable
    const colDefs: ColDef[] = [
        { headerName: 'ID', field: 'id', editable: false }, // Non-editable field
        { headerName: 'Book', field: 'book.title', editable: false }, // Book title is non-editable
        { headerName: 'Member', field: 'Member.username', editable: false }, // Member name is non-editable
        { headerName: 'Issued Date', field: 'issued_date', editable: true }, // Editable field
        { headerName: 'Due Date', field: 'due_date', editable: true }, // Editable field
        { headerName: 'Returned Date', field: 'returned_date', editable: true }, // Editable field
        { headerName: 'Fine', field: 'fine', editable: true }, // Editable field
        { headerName: 'Status', field: 'status', editable: true }, // Editable field (e.g., "Returned", "Pending")
        { headerName: 'Created At', field: 'created_at', editable: false }, // Non-editable field
        { headerName: 'Updated At', field: 'updated_at', editable: false }, // Non-editable field
        {
            headerName: 'Actions',
            field: 'actions',
            minWidth: 150,  // Adjust column width
            cellRenderer: (params: any) => (
                <div className="flex space-x-1">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded"
                        onClick={() => handleDelete(params.data.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        filter: true,
        sortable: true,
    };

    return (
        <div className={'flex flex-col'}>
            <div className={"flex flex-row justify-between"}>
                <h1 className="text-3xl font-bold mb-7">Loan Management</h1>
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
                        // Navigate to the create loan page
                        router.push('/dashboard/admin/loan/create');
                    }}
                >
                    Add Loan
                </Button>
            </div>
            <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellChange} // Trigger API update on cell change
                />
            </div>
        </div>
    );
}
