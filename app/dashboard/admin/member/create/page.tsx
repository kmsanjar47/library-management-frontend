"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import branchAtom from "@/atoms/branch-atom";
import { useAtom } from "jotai";

export default function MemberCreation() {
    const router = useRouter();
    const [branchAtomData] = useAtom(branchAtom);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',   // Added password field
        first_name: '', // Added first name field
        last_name: '',  // Added last name field
        is_superuser: false,
        is_active: true,
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
            const response = await fetch("http://127.0.0.1:8000/api/register/", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Member created successfully:", result);
            router.push("/dashboard/admin/member");
        } catch (error) {
            console.error("Error creating member:", error);
        }
    };

    return (
        <div className="flex flex-col m-10">
            <div className="flex flex-row justify-between">
                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        router.push('/dashboard/admin/member');
                    }}
                >
                    Back
                </Button>
                <h1 className="text-3xl font-bold mb-7">Member Creation</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label>Username</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>First Name</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Last Name</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Is Admin</label>
                    <input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="is_superuser"
                        type="checkbox"
                        checked={formData.is_superuser}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Is Active</label>
                    <input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="is_active"
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                    />
                </div>

                <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Create Member
                </Button>
            </form>
        </div>
    );
}
