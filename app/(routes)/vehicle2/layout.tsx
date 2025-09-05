import AppFooter from "@/components/footer";

export default async function VehicleDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="flex-1 mt-18 md:mt-24 lg:mt-24 mb-12 px-4 lg:px-8">
                {children}
            </main>
            <AppFooter />
        </>
    );
}