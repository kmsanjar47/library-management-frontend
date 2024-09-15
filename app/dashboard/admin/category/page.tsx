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
import categoryAtom from "@/atoms/category-atom";
import { useAtom } from "jotai";

export default function CategoryManagement() {
    const router = useRouter();
    const [categoryAtomData, setCategory] = useAtom(categoryAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch data from server
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/close/category', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`, // Add the token to the Authorization header
                    },
                });
                if (response.status === 200) {
                    toast.success('Categories fetched successfully');
                    const result = await response.json();
                    setCategory(result);
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

    // Handle cell value change (update API call)
    const onCellValueChanged = async (event: any) => {
        const { data } = event;
        try {
            const response = await fetch(`http://localhost:8000/api/v1/close/category/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                }),
            });

            if (response.ok) {
                toast.success('Category updated successfully');
            } else {
                toast.error('Failed to update category');
            }
        } catch (error) {
            toast.error(error.message.toString());
        }
    };

    // Handle delete action
    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/v1/close/category/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    },
                });
                if (response.ok) {
                    toast.success('Category deleted successfully');
                    setCategory(categoryAtomData.filter((category: any) => category.id !== id)); // Remove deleted item from state
                } else {
                    toast.error('Failed to delete category');
                }
            } catch (error) {
                toast.error(error.message.toString());
            } finally {
                setLoading(false);
            }
        }
    };

    const colDefs: ColDef[] = [
        { headerName: 'ID', field: 'id', editable: false },
        { headerName: 'Name', field: 'name', editable: true }, // Allow inline editing for 'name'
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
                <h1 className="text-3xl font-bold mb-7">Category Management</h1>
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
                        // Navigate to the create category page
                        router.push('/dashboard/admin/category/create');
                    }}
                >
                    Add Category
                </Button>
            </div>
            <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                <AgGridReact
                    rowData={categoryAtomData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={onCellValueChanged} // Listen for cell value changes
                />
            </div>
        </div>
    );
}
