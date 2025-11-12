import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/events/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>
      <p className="text-muted-fg mb-8">
        Join our upcoming blood donation events and help save lives in your
        community.
      </p>

      <div className="space-y-6">
        {/* Placeholder for events - will be populated with actual data */}
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Community Blood Donation Camp
              </h3>
              <p className="text-muted-fg mb-2">
                Join us for a community-wide blood donation camp. All blood
                groups are needed.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-fg">
                <span>📍 City Community Center</span>
                <span>📅 December 15, 2024</span>
                <span>⏰ 9:00 AM - 6:00 PM</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-fg mb-2">
                Blood Donation Drive
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Emergency Blood Collection Drive
              </h3>
              <p className="text-muted-fg mb-2">
                Emergency blood collection drive to replenish critical blood
                supplies.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-fg">
                <span>📍 Central Hospital</span>
                <span>📅 December 20, 2024</span>
                <span>⏰ 10:00 AM - 4:00 PM</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-fg mb-2">Emergency Drive</div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Year-End Blood Marathon
              </h3>
              <p className="text-muted-fg mb-2">
                Special year-end blood donation marathon with refreshments and
                health checkups.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-fg">
                <span>📍 Multiple Locations</span>
                <span>📅 December 28-31, 2024</span>
                <span>⏰ 8:00 AM - 8:00 PM</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-fg mb-2">Special Event</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
