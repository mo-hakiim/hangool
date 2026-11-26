import { createFileRoute } from "@tanstack/react-router";

import { ResourcePage } from "@/admin/resource-page";
import { resources } from "@/admin/resources";
import { RequireRole } from "@/admin/ui";

export const Route = createFileRoute("/admin/projects")({
  component: () => (
    <RequireRole area="content">
      <ResourcePage resource={resources["projects"]!} />
    </RequireRole>
  ),
});
