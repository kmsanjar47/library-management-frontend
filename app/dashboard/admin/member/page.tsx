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
import memberAtom from "@/atoms/member-atom";
import { useAtom } from "jotai";

export default function MemberManagement() {
    const router = useRouter();
    const [memberAtomData, setMember] = useAtom(memberAtom);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch data from server
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:8000/api/register/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('authToken')}`, // Add the token to the Authorization header
                    },
                });
                if (response.status === 200) {
                    toast.success('Members fetched successfully');
                    const result = await response.json();
                    setMember(result);
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

    // Define column definitions and mark certain fields as editable
    const colDefs: ColDef[] = [
        { headerName: 'ID', field: 'id' },
        { headerName: 'Name', field: 'username', editable: true },  // Editable field
        { headerName: 'Email', field: 'email', editable: true },   // Editable field
        { headerName: 'Password', field: 'password', editable: true },  // Editable field (use with caution)
        { headerName: 'Is Admin', field: 'is_superuser', editable: true },  // Editable field
        { headerName: 'Is Active', field: 'is_active', editable: true },    // Editable field
        { headerName: 'First Name', field: 'first_name', editable: true },  // Editable field
        { headerName: 'Last Name', field: 'last_name', editable: true },    // Editable field
        { headerName: 'Membership Start Date', field: 'date_joined' }
    ];

    const defaultColDef = {
        flex: 1,
        minWidth: 100,
        filter: true,
        sortable: true,
        editable: false,  // Make all columns non-editable by default
    };

    // Function to handle cell value change and update API
    const handleCellValueChange = async (params) => {
        const updatedMember = params.data; // The updated row data
        const memberId = updatedMember.id;

        try {
            // Call the update API
            const response = await fetch(`http://127.0.0.1:8000/api/register/`, {
                method: 'PUT',  // PUT method to update the data
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMember),
            });

            if (!response.ok) {
                throw new Error(`Failed to update member: ${response.status}`);
            }

            const result = await response.json();
            toast.success('Member updated successfully');
            console.log("Updated member:", result);

            // Update the state with the modified data
            setMember((prevMembers) =>
                prevMembers.map((member) =>
                    member.id === memberId ? updatedMember : member
                )
            );
        } catch (error) {
            toast.error(`Error updating member: ${error.message}`);
        }
    };

    return (
        <div className={'flex flex-col'}>
            <div className={"flex flex-row justify-between"}>
                <h1 className="text-3xl font-bold mb-7">Member Management</h1>
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
                        // Navigate to the create member page
                        router.push('/dashboard/admin/member/create');
                    }}
                >
                    Add Member
                </Button>
            </div>
            <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
                <AgGridReact
                    rowData={memberAtomData}     // Row data from atom
                    columnDefs={colDefs}          // Column definitions
                    defaultColDef={defaultColDef} // Default column settings
                    onCellValueChanged={handleCellValueChange}  // Listen for cell value changes
                />
            </div>
        </div>
    );
}
