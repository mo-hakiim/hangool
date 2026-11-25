import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/admin/resource-page";
import { resources } from "@/admin/resources";

export const Route = createFileRoute("/admin/team")({
  component: () => <ResourcePage resource={resources["team"]!} />,
});
