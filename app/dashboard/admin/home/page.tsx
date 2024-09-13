import {RadialChart} from "@/components/ui/radial-chart";

export default function Dashboard (){
    const chartData = [
        { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    ];

    const chartConfig = {
        visitors: {
            label: "Books",
            color:"hsl(0, 0%, 100%)"
        },
        safari: {
            label: "Safari",
            color: "hsla(334, 100%, 50%, 1)",
        },
    }; // Ensure this matches your ChartConfig type


    return <div>
        <div className="flex flex-col p-10 text-white">
            <h1 className="text-3xl font-bold mb-7">Admin Dashboard</h1>
            <div className={"flex flex-row gap-3"}>

                <RadialChart
                    title="Total Books"
                    totalLabel="Books"
                    totalValue={500}
                    chartData={chartData}
                    chartConfig={chartConfig}
                    percentageChange="5.2%"
                    footerText="Showing total books saved until now"
                />
                <RadialChart
                    title="Total Books"
                    totalLabel="Books"
                    totalValue={500}
                    chartData={chartData}
                    chartConfig={chartConfig}
                    percentageChange="5.2%"
                    footerText="Showing total books saved until now"
                />
                <RadialChart
                    title="Total Books"
                    totalLabel="Books"
                    totalValue={500}
                    chartData={chartData}
                    chartConfig={chartConfig}
                    percentageChange="5.2%"
                    footerText="Showing total books saved until now"
                />
                <RadialChart
                    title="Total Books"
                    totalLabel="Books"
                    totalValue={500}
                    chartData={chartData}
                    chartConfig={chartConfig}
                    percentageChange="5.2%"
                    footerText="Showing total books saved until now"
                />

            </div>
        </div>
    </div>
}


