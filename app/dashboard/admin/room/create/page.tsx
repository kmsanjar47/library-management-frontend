"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import memberAtom from "@/atoms/member-atom";
import {useAtom} from "jotai";

export default function RoomCreation() {
    const router = useRouter();
    const [memberAtomData] = useAtom(memberAtom);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: '',
        projector: false,
        tv: false,
        status: 'unavailable', // Default value based on choices
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/api/v1/close/room", {
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
            console.log("Room created successfully:", result);
            router.push("/dashboard/admin/room");
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    return (
        <div className={'flex flex-col m-10'}>
            <div className={"flex flex-row justify-between"}>
                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        router.push('/dashboard/admin/room');
                    }}
                >
                    Back
                </Button>
                <h1 className="text-3xl font-bold mb-7">Room Creation</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label>Name</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Capacity</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Projector</label>
                    <input
                        type="checkbox"
                        name="projector"
                        checked={formData.projector}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>TV</label>
                    <input
                        type="checkbox"
                        name="tv"
                        checked={formData.tv}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Status</label>
                    <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
                <div>
                    <label>Booked Date</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="booked_date"
                        type="date"
                        value={formData.booked_date}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Booked Time</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="booked_time"
                        type="time"
                        value={formData.booked_time}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Next Available Slot</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="next_available_slot"
                        type="time"
                        value={formData.next_available_slot}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Booked by</label>
                    <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="booked_by"
                        value={formData.booked_by}
                        onChange={handleInputChange}
                    >
                        <option value="">Select a member</option>
                        {memberAtomData.map(member => (
                            <option key={member.id} value={member.id}>
                                {member.username}
                            </option>
                        ))}
                    </select>
                </div>

                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Create Room
                </Button>
            </form>
        </div>
    );
}
