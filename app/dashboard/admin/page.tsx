import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {RadialChart} from "@/components/ui/radial-chart";

export default function Dashboard (){
    return <div>
        <div className="flex flex-col p-10 text-white">
            <h1 className="text-3xl font-bold mb-7">Admin Dashboard</h1>
            <div className={"flex flex-row gap-2"}>
                <Card className={'w-[300px] h-[200px] flex flex-col items-center justify-center'}>
                    <CardHeader>
                        <CardTitle className={'text-4xl text-center'}>
                            Total Books
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={"text-2xl text-center"}>
                        100
                    </CardContent>
                </Card>
                <Card className={'w-[300px] h-[200px] flex flex-col items-center justify-center'}>
                    <CardHeader>
                        <CardTitle className={'text-4xl text-center'}>
                            Total Members
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={"text-2xl text-center"}>
                        120
                    </CardContent>
                </Card>
                <Card className={'w-[300px] h-[200px] flex flex-col items-center justify-center'}>
                    <CardHeader>
                        <CardTitle className={'text-4xl text-center'}>
                            Total Authors
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={"text-2xl text-center"}>
                        200
                    </CardContent>
                </Card>
            </div>
            </div>
    </div>
}