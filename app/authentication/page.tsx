"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";

export default function Page() {
    const [signInInfo, setSignInInfo] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Function to set cookie
    const setCookie = (name: string, value: string, days: number) => {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // cookie expires in `days` days
        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    };

    // Function to handle login
    const handleSignIn = async () => {
        if (!signInInfo.username || !signInInfo.password) {
            toast.error("Please fill in both fields");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: signInInfo.username,
                    password: signInInfo.password,
                }),
            });

            const result = await response.json();

            if (response.status === 200 && result.token) {
                // Save the token in localStorage
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user_id', result.user_id);

                // Set the token in cookies for session management
                setCookie('authToken', result.token, 1); // expires in 7 days

                // Check if the user is a superuser and active, then redirect accordingly
                if (result.is_superuser && result.is_active) {
                    toast.success("Login successful, redirecting to admin dashboard...");
                    router.push('/dashboard/admin');
                } else if (result.is_active) {
                    toast.success("Login successful, redirecting to dashboard...");
                    router.push('/dashboard');
                } else {
                    toast.error("Account is not active. Please contact admin.");
                }
            } else {
                toast.error("Invalid login credentials");
            }
        } catch (error) {
            toast.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row">
            {/* Left Panel with Background Image */}
            <div className="relative bg-black h-[100vh] w-[50%] text-white overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: 'url("/lib/assets/bg.jpg")' }}
                ></div>
                {/* Dark Overlay for Better Readability */}
                <div className="absolute inset-0 bg-black opacity-40"></div>
                {/* Content on Top of Background */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full p-10 space-y-6">
                    {/* Logo */}
                    {/*<Image*/}
                    {/*    src="/lib/assets/logo.png"*/}
                    {/*    alt="Library Logo"*/}
                    {/*    width={80}*/}
                    {/*    height={80}*/}
                    {/*    className="mb-6"*/}
                    {/*/>*/}

                    {/* Welcome Message */}
                    <h1 className="text-4xl font-bold mb-2 text-center">
                        Welcome to the Library
                    </h1>
                    {/* Brief Description */}
                    <p className="text-center text-lg px-4 max-w-md leading-relaxed">
                        Manage your books, track inventory, and explore our vast collection with ease.
                    </p>
                    {/* Features or Tagline */}
                    <ul className="mt-4 space-y-2 text-center">
                        <li>📚 Explore thousands of books</li>
                        <li>📈 Track inventory seamlessly</li>
                        <li>⚡ Fast and secure</li>
                    </ul>
                </div>
            </div>

            {/* Right Panel (Sign-In/Sign-Up) */}
            <div className="bg-white h-[100vh] w-[50%] p-10 flex flex-col justify-center items-center gap-4 text-black">
                <Tabs defaultValue="sign-in" className="w-[100%] p-10">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* Sign In Tab */}
                    <TabsContent value="sign-in">
                        <div className="text-black text-3xl">
                            <h1 className="flex flex-col justify-center items-center mb-5">
                                Sign In
                            </h1>
                            <Input
                                value={signInInfo.username}
                                onChange={(e) =>
                                    setSignInInfo({
                                        ...signInInfo,
                                        username: e.target.value,
                                    })
                                }
                                placeholder="Username"
                                className="rounded-md mb-2"
                            />
                            <Input
                                type="password"
                                value={signInInfo.password}
                                onChange={(e) =>
                                    setSignInInfo({
                                        ...signInInfo,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="Password"
                                className="rounded-md mb-2"
                            />
                            <Button
                                onClick={handleSignIn}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Sign Up Tab */}
                    <TabsContent value="sign-up">
                        <div className="text-black text-3xl">
                            <h1 className="flex flex-col justify-center items-center mb-5">
                                Sign Up
                            </h1>
                            <Input placeholder="Username" className="rounded-md mb-2" />
                            <Input placeholder="Email" className="rounded-md mb-2" />
                            <Input placeholder="Password" className="rounded-md" />
                            <Button>Sign Up</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
