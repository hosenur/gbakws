import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/causes/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Causes</h1>
      <p className="text-muted-fg mb-8">
        Browse through our causes and support the ones that matter to you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for causes - will be populated with actual data */}
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Blood Donation Drive</h3>
          <p className="text-muted-fg mb-4">
            Join us for our monthly blood donation drive to help save lives in
            our community.
          </p>
          <div className="text-sm text-muted-fg">
            Learn more about this cause and how you can contribute.
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Emergency Blood Bank</h3>
          <p className="text-muted-fg mb-4">
            Supporting emergency medical needs with readily available blood
            supplies.
          </p>
          <div className="text-sm text-muted-fg">
            Help us maintain critical blood reserves for emergencies.
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">
            Community Health Initiative
          </h3>
          <p className="text-muted-fg mb-4">
            Promoting health awareness and regular blood donation in our
            community.
          </p>
          <div className="text-sm text-muted-fg">
            Join our community health programs and awareness campaigns.
          </div>
        </div>
      </div>
    </div>
  );
}
