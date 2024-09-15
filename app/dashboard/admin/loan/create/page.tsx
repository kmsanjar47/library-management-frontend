"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import bookAtom from "@/atoms/book-atom";
import memberAtom from "@/atoms/member-atom";

export default function LoanCreation() {
    const router = useRouter();
    const [bookAtomData] = useAtom(bookAtom);
    const [memberAtomData] = useAtom(memberAtom);
    const [formData, setFormData] = useState({
        book: '',
        Member: '',
        issued_date: '',
        due_date: '',
        status: 'issued', // Default status
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
            const response = await fetch("http://localhost:8000/api/v1/close/loan", {
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
            console.log("Loan created successfully:", result);
            router.push("/dashboard/admin/loan");
        } catch (error) {
            console.error("Error creating loan:", error);
        }
    };

    return (
        <div className={'flex flex-col m-10'}>
            <div className={"flex flex-row justify-between"}>
                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        router.push('/dashboard/admin/loan');
                    }}
                >
                    Back
                </Button>
                <h1 className="text-3xl font-bold mb-7">Loan Creation</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label>Book</label>
                    <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="book"
                        value={formData.book}
                        onChange={handleInputChange}
                    >
                        <option value="">Select a book</option>
                        {bookAtomData.map(book => (
                            <option key={book.id} value={book.id}>
                                {book.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Member</label>
                    <select
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="Member"
                        value={formData.Member}
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
                <div>
                    <label>Issued Date</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="issued_date"
                        type="date"
                        value={formData.issued_date}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Due Date</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="due_date"
                        type="date"
                        value={formData.due_date}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Returned Date</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="returned_date"
                        type="date"
                        value={formData.returned_date}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Fine</label>
                    <Input
                        className="border border-gray-300 rounded-md p-2 w-full"
                        name="fine"
                        type="number"
                        step="0.01"
                        value={formData.fine}
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
                        <option value="issued">Issued</option>
                        <option value="returned">Returned</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
                <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                    Create Loan
                </Button>
            </form>
        </div>
    );
}
