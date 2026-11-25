import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { pageHead } from "@/lib/seo";

// "Media & Updates" was renamed to Gallery. Old links keep working.
export const Route = createFileRoute("/media")({
  head: () => {
    const head = pageHead("gallery", "/gallery", { noindex: true });
    return {
      ...head,
      meta: [...head.meta, { httpEquiv: "refresh", content: "0; url=../gallery" }],
    };
  },
  component: MediaRedirect,
});

function MediaRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/gallery", replace: true });
  }, [navigate]);
  return (
    <section className="section">
      <div className="site-container">
        <Link to="/gallery" className="text-primary font-semibold">
          Gallery →
        </Link>
      </div>
    </section>
  );
}
