import { RadialChart } from "@/components/ui/radial-chart";


export default function Dashboard() {
    const chartData = [
        { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    ];

    const chartConfig = {
        visitors: {
            label: "Books",
            color: "hsl(0, 0%, 100%)"
        },
        safari: {
            label: "Safari",
            color: "hsla(334, 100%, 50%, 1)",
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Page Header */}
            <div className="text-gray-900 mb-8">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <RadialChart
                        title="Total Books"
                        totalLabel="Books"
                        totalValue={500}
                        chartData={chartData}
                        chartConfig={chartConfig}
                        percentageChange="5.2%"
                        footerText="Total number of books in the library"
                    />
                </div>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <RadialChart
                        title="Total Loans"
                        totalLabel="Loans"
                        totalValue={320}
                        chartData={chartData}
                        chartConfig={chartConfig}
                        percentageChange="2.8%"
                        footerText="Total number of loans issued"
                    />
                </div>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <RadialChart
                        title="Total Rooms"
                        totalLabel="Rooms"
                        totalValue={100}
                        chartData={chartData}
                        chartConfig={chartConfig}
                        percentageChange="7.5%"
                        footerText="Total number of rooms available"
                    />
                </div>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <RadialChart
                        title="Total Users"
                        totalLabel="Users"
                        totalValue={1200}
                        chartData={chartData}
                        chartConfig={chartConfig}
                        percentageChange="4.3%"
                        footerText="Total number of registered users"
                    />
                </div>
            </div>
        </div>
    );
}
