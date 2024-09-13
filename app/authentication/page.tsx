"use client"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";

export default function Page() {
    const [signInInfo, setSignInInfo] = useState({username: '', password: ''});
    return <div className="flex flex-row">
        <div className="bg-black h-[100vh] w-[50%]" id='left-card'>
            <div className="flex justify-center align-middle text-white text-3xl">
                <h1>Welcome to library management system</h1>
            </div>
        </div>
        <div className="bg-white h-[100vh] w-[50%] p-10 flex flex-col justify-center align-middle items-center gap-4"
             id='right-card'>

            <Tabs defaultValue="sign-in" className="w-[100%] p-10">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="sign-in">
                    <div className="text-black text-3xl">
                        <h1 className="flex flex-col justify-center items-center mb-5">Sign In</h1>
                        <Input value={signInInfo.username} onChange={(e) => setSignInInfo({
                            ...signInInfo, username: e.target.value
                        })} placeholder="Username" className="rounded-md mb-2"/>
                        <Input value={
                            signInInfo.password
                        } onChange={(e) => setSignInInfo({
                            ...signInInfo, password: e.target.value
                        })
                        } placeholder="Password" className="rounded-md"/>
                        <Button>Sign In</Button>
                    </div>

                </TabsContent>
                <TabsContent value="sign-up">
                    <div className="text-black text-3xl">
                        <h1 className="flex flex-col justify-center items-center mb-5">Sign Up</h1>
                        <Input placeholder="Username" className="rounded-md mb-2"/>
                        <Input placeholder="Email" className="rounded-md mb-2"/>
                        <Input placeholder="Password" className="rounded-md"/>
                        <Button>Sign Up</Button>
                    </div>

                </TabsContent>
            </Tabs>
        </div>
    </div>
}