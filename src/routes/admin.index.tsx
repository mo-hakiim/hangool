import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  HardHat,
  Images,
  Inbox,
  KeyRound,
  Newspaper,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useAdminRows, type Row } from "@/admin/data";
import { useAdminAuth } from "@/admin/auth";
import { Panel, ROLE_LABELS, canAccess } from "@/admin/ui";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

const NEW = "select=id&status=eq.new";
const ALL = "select=id,published";

function Count({ table, query }: { table: string; query: string }) {
  const q = useAdminRows<Row>(table, query);
  if (q.isPending) return <span className="text-muted-foreground">…</span>;
  if (q.isError) return <span className="text-destructive">!</span>;
  return <>{q.data.length}</>;
}

function Published({ table }: { table: string }) {
  const q = useAdminRows<Row>(table, ALL);
  if (!q.data) return null;
  const live = q.data.filter((r) => r["published"]).length;
  return (
    <span className="text-xs text-muted-foreground">
      {live} published · {q.data.length - live} draft
    </span>
  );
}

function Tile({
  to,
  icon: Icon,
  label,
  table,
}: {
  to:
    | "/admin/projects"
    | "/admin/properties"
    | "/admin/gallery"
    | "/admin/team"
    | "/admin/news"
    | "/admin/careers";
  icon: LucideIcon;
  label: string;
  table: string;
}) {
  return (
    <Link to={to} className="rounded-sm border bg-card p-5 transition-colors hover:border-primary">
      <Icon className="size-5 text-primary" />
      <p className="mt-3 text-sm font-semibold">{label}</p>
      <p className="text-2xl font-bold">
        <Count table={table} query={ALL} />
      </p>
      <Published table={table} />
    </Link>
  );
}

function Overview() {
  const { role } = useAdminAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {role ? (
            <>
              You're signed in as <strong>{ROLE_LABELS[role].name}</strong>:{" "}
              {ROLE_LABELS[role].description.toLowerCase()}.
            </>
          ) : (
            "Everything you can manage."
          )}
        </p>
      </div>
      {canAccess(role, "requests") && (
        <Panel title="New requests">
          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                ["inquiries", "Contact messages"],
                ["quote_requests", "Quote requests"],
                ["viewing_requests", "Viewing requests"],
              ] as const
            ).map(([table, label]) => (
              <Link
                key={table}
                to="/admin/requests"
                search={{ tab: table, show: "new" }}
                className="rounded-sm border p-5 transition-colors hover:border-primary"
              >
                <Inbox className="size-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">{label}</p>
                <p className="text-3xl font-bold">
                  <Count table={table} query={NEW} />
                </p>
                <span className="text-xs text-muted-foreground">waiting for a reply</span>
              </Link>
            ))}
          </div>
        </Panel>
      )}
      {canAccess(role, "content") && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tile to="/admin/projects" icon={HardHat} label="Projects" table="projects" />
          <Tile to="/admin/properties" icon={KeyRound} label="Properties" table="properties" />
          <Tile to="/admin/gallery" icon={Images} label="Gallery items" table="gallery_items" />
          <Tile to="/admin/team" icon={Users} label="Team members" table="team_members" />
          <Tile to="/admin/news" icon={Newspaper} label="Articles" table="blog_posts" />
          <Tile to="/admin/careers" icon={Briefcase} label="Job openings" table="job_openings" />
        </div>
      )}
      {canAccess(role, "owner") && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/staff"
            className="flex items-center gap-3 rounded-sm border bg-card p-5 transition-colors hover:border-primary"
          >
            <UserCog className="size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Staff</p>
              <p className="text-xs text-muted-foreground">
                Invite people, choose their role, deactivate or remove them, and see the history.
              </p>
            </div>
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 rounded-sm border bg-card p-5 transition-colors hover:border-primary"
          >
            <Settings className="size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Settings</p>
              <p className="text-xs text-muted-foreground">
                Company figures, contact details, social links, alert email and map location.
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
