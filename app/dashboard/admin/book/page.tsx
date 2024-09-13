import {Table} from "@/components/ui/table";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Image from "next/image";
import BookCoverPic from "/lib/assets/book-cover-1.jpg";

export default function BookManagement (){
    return <div className={'flex flex-col'}>
        <h1 className="text-3xl font-bold mb-7">Book Management</h1>
        <div className={'flex flex-wrap gap-10'}>
            <Card className={'overflow-clip'}>

                    <Image  src={BookCoverPic} alt={'book-cover'} width={250} />
                <CardFooter className={'flex flex-row justify-between mt-4 font-bold'}>
                    <div>Book 1</div>
                    <div className={"p-1.5 bg-green-500 rounded-xl"}>Available</div>
                </CardFooter>

            </Card>
            <Card className={'overflow-clip'}>

                    <Image  src={BookCoverPic} alt={'book-cover'} width={250} />
                <CardFooter className={'flex flex-row justify-between mt-4 font-bold'}>
                    <div>Book 1</div>
                    <div className={"p-1.5 bg-green-500 rounded-xl"}>Available</div>
                </CardFooter>

            </Card>
            <Card className={'overflow-clip'}>

                <Image  src={BookCoverPic} alt={'book-cover'} width={250} />
                <CardFooter className={'flex flex-row justify-between mt-4 font-bold'}>
                    <div>Book 1</div>
                    <div className={"p-1.5 bg-green-500 rounded-xl"}>Available</div>
                </CardFooter>

            </Card>
            <Card className={'overflow-clip'}>

                <Image  src={BookCoverPic} alt={'book-cover'} width={250} />
                <CardFooter className={'flex flex-row justify-between mt-4 font-bold'}>
                    <div>Book 1</div>
                    <div className={"p-1.5 bg-green-500 rounded-xl"}>Available</div>
                </CardFooter>

            </Card>
            <Card className={'overflow-clip'}>

                <Image  src={BookCoverPic} alt={'book-cover'} width={250} />
                <CardFooter className={'flex flex-row justify-between mt-4 font-bold'}>
                    <div>Book 1</div>
                    <div className={"p-1.5 bg-green-500 rounded-xl"}>Available</div>
                </CardFooter>

            </Card>
        </div>
    </div>
}