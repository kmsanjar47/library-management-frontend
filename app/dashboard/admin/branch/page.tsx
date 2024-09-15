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
import branchAtom from "@/atoms/branch-atom";
import { useAtom } from "jotai";

export default function BranchManagement() {
    const router = useRouter();
    const [branchAtomData, setBranch] = useAtom(branchAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch data from server
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/close/branch', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`, // Add the token to the Authorization header
                    },
                });
                if (response.status === 200) {
                    toast.success('Branches fetched successfully');
                    const result = await response.json();
                    setBranch(result);
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
        if (confirm("Are you sure you want to delete this branch?")) {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/v1/close/branch/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    },
                });
                if (response.ok) {
                    toast.success('Branch deleted successfully');
                    setBranch(branchAtomData.filter((branch: any) => branch.id !== id)); // Remove the deleted item from the state
                } else {
                    toast.error('Failed to delete branch');
                }
            } catch (error) {
                toast.error(error.message.toString());
            } finally {
                setLoading(false);
            }
        }
    };

    // Handle update action when a cell value changes
    const handleCellChange = async (event: any) => {
        const { id } = event.data; // The branch ID
        const updatedData = event.data; // Updated row data

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/v1/close/branch/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                toast.success('Branch updated successfully');
            } else {
                toast.error('Failed to update branch');
            }
        } catch (error) {
            toast.error(error.message.toString());
        } finally {
            setLoading(false);
        }
    };

    const colDefs: ColDef[] = [
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: 'Branch Name', field: 'branch_name', editable: true },  // Editable
        { headerName: 'Branch Address', field: 'branch_address', editable: true }, // Editable
        { headerName: 'Branch Phone', field: 'branch_phone', editable: true }, // Editable
        { headerName: 'Branch Email', field: 'branch_email', editable: true }, // Editable
        { headerName: 'Created At', field: 'created_at', editable: false },
        { headerName: 'Updated At', field: 'updated_at', editable: false },
        {
            headerName: 'Actions',
            field: 'actions',
            minWidth: 150,
            cellRenderer: (params: any) => (
                <button
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(params.data.id)}
                >
                    Delete
                </button>
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
                <h1 className="text-3xl font-bold mb-7">Branch Management</h1>
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
                        // Navigate to the create branch page
                        router.push('/dashboard/admin/branch/create');
                    }}
                >
                    Add Branch
                </Button>
            </div>
            <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                <AgGridReact
                    rowData={branchAtomData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellChange}  // Listen for changes
                />
            </div>
        </div>
    );
}
