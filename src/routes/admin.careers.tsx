import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/admin/resource-page";
import { resources } from "@/admin/resources";

export const Route = createFileRoute("/admin/careers")({
  component: () => <ResourcePage resource={resources["careers"]!} />,
});
