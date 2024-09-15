"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BranchCreation() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        branch_name: '',
        branch_email: '',
        branch_phone: '',
        branch_address: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/v1/close/branch", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    'Authorization': `Token ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("branch created successfully:", result);
            router.push("/dashboard/admin/branch");
        } catch (error) {
            console.error("Error creating branch:", error);
        }
    };

    return (
        <div className={'flex flex-col m-10'}>
            <div className={"flex flex-row justify-between"}>
                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        router.push('/dashboard/admin/branch');
                    }}
                >
                    Back
                </Button>
                <h1 className="text-3xl font-bold mb-7">Branch Creation</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label>Name</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="branch_name"
                        value={formData.branch_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="branch_email"
                        type="email"
                        value={formData.branch_email}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Phone</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="branch_phone"
                        value={formData.branch_phone}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Address</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="branch_address"
                        value={formData.branch_address}
                        onChange={handleInputChange}
                    />
                </div>

                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Create Branch
                </Button>
            </form>
        </div>
    );
}
