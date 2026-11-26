import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/admin/resource-page";
import { resources } from "@/admin/resources";
import { RequireRole } from "@/admin/ui";

export const Route = createFileRoute("/admin/careers")({
  component: () => (
    <RequireRole area="content">
      <ResourcePage resource={resources["careers"]!} />
    </RequireRole>
  ),
});
