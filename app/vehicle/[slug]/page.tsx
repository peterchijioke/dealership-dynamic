export default function VehiclePage({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Vehicle Details</h1>
            <p>Slug: {params.slug}</p>
        </div>
    );
}
