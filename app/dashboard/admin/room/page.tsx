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
import {useAtom} from "jotai";
import roomAtom from "@/atoms/room-atom";

export default function RoomManagement() {
    const router = useRouter();
    const [roomAtomData, setRoom] = useAtom(roomAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch data from server
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/v1/close/room', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    },
                });
                if (response.status === 200) {
                    toast.success('Rooms fetched successfully');
                    const result = await response.json();
                    setRoom(result);
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
        if (confirm("Are you sure you want to delete this room?")) {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8000/api/v1/close/room/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    },
                });
                if (response.ok) {
                    toast.success('Room deleted successfully');
                    setRoom(roomAtomData.filter((room: any) => room.id !== id)); // Remove the deleted item from the state
                } else {
                    toast.error('Failed to delete room');
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
        const { id } = event.data; // The room ID
        const updatedData = event.data; // Updated row data

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/v1/close/room/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                toast.success('Room updated successfully');
            } else {
                toast.error('Failed to update room');
            }
        } catch (error) {
            toast.error(error.message.toString());
        } finally {
            setLoading(false);
        }
    };

    const colDefs: ColDef[] = [
        { headerName: 'Room Name', field: 'name', editable: true },  // Editable
        { headerName: 'Status', field: 'status', editable: true },  // Editable
        { headerName: 'Capacity', field: 'capacity', editable: true },  // Editable
        { headerName: 'Projector', field: 'projector', editable: true, cellRenderer: (params) => params.value ? 'Yes' : 'No' },
        { headerName: 'TV', field: 'tv', editable: true, cellRenderer: (params) => params.value ? 'Yes' : 'No' },
        { headerName: 'Booked Date', field: 'booked_date', editable: true },  // Editable
        { headerName: 'Booked Time', field: 'booked_time', editable: true },  // Editable
        { headerName: 'Next Available Slot', field: 'next_available_slot', editable: true },
        { headerName: 'Booked By', field: 'booked_by.name' },
        {
            headerName: 'Actions',
            field: 'actions',
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
                <h1 className="text-3xl font-bold mb-7">Room Management</h1>
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
                    <Button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            // Navigate to the create room page
                            router.push('/dashboard/admin/room/create');
                        }}
                    >
                        Add Room
                    </Button>
                )}
            </div>
            <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                <AgGridReact
                    rowData={roomAtomData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={handleCellChange}  // Listen for changes
                />
            </div>
        </div>
    );
}
