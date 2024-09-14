"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function BookCreation() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publishedDate: '',
        edition: '',
        numberOfPages: '',
        language: '',
        book_cover: null // To store the file
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            book_cover: file
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('author', formData.author);
        submissionData.append('isbn', formData.isbn);
        submissionData.append('publisher', formData.publisher);
        submissionData.append('publishedDate', formData.publishedDate);
        submissionData.append('edition', formData.edition);
        submissionData.append('numberOfPages', formData.numberOfPages);
        submissionData.append('language', formData.language);
        if (formData.book_cover) {
            submissionData.append('book_cover', formData.book_cover);
        }

        try {
            const response = await fetch("http://localhost:8000/api/v1/close/book", {
                method: "POST",
                body: submissionData,
                headers: {
                    'Authorization': `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                    // Note: Do not set 'Content-Type' here. FormData will set it correctly.
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Book created successfully:", result);
            router.push("/dashboard/admin/book");
        } catch (error) {
            console.error("Error creating book:", error);
        };


        try {
            const response = await fetch("http://localhost:8000/api/v1/close/book", {
                method: "POST",
                body: submissionData,
                headers: {
                    Authorization: `Token 853b865bdb3e7775b3f6be62501240829574fff8`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Book created successfully:", result);
            router.push("/dashboard/admin/book");
        } catch (error) {
            console.error("Error creating book:", error);
        }
    };

    return (
        <div className={'flex flex-col m-10'}>
            <div className={"flex flex-row justify-between"}>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            router.push('/dashboard/admin/book');
                        }}>
                    Back
                </Button>
                <h1 className="text-3xl font-bold mb-7">Book Creation</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                    <label>Title</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="title" value={formData.title}
                           onChange={handleInputChange}/>
                </div>
                <div>
                    <label>Author</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="author" value={formData.author} onChange={handleInputChange} />
                </div>
                <div>
                    <label>ISBN</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="isbn" value={formData.isbn}
                           onChange={handleInputChange}/>
                </div>
                <div>
                    <label>Publisher</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="publisher" value={formData.publisher} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Published Date</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="publishedDate"
                           value={formData.publishedDate} onChange={handleInputChange}/>
                </div>
                <div>
                    <label>Edition</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="edition"
                           value={formData.edition} onChange={handleInputChange}/>
                </div>
                <div>
                    <label>Number of Pages</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="numberOfPages"
                           value={formData.numberOfPages} onChange={handleInputChange}/>
                </div>
                <div>
                    <label>Language</label>
                    <Input className="border border-gray-300 rounded-md p-2 w-full" name="language"
                           value={formData.language} onChange={handleInputChange}/>
                </div>
                <div>
                    <label>Cover Image</label>
                    <input type="file"
                           accept="image/jpeg, image/png, image/jpg, image/gif, image/heic"
                           className="border border-gray-300 rounded-md p-2 w-full" name="book_cover"
                           onChange={handleFileChange}/>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Create
                    Book</Button>
            </form>
        </div>
    );
}
