import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ExternalLink,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { storageUrl } from "@/lib/supabase";
import { useAdminRows, useAdminWrite, useUpload, type Row } from "./data";
import type { FieldDef, Resource } from "./resources";
import {
  ConfirmDelete,
  ErrorBox,
  Field,
  Panel,
  Spinner,
  errorMessage,
  inputClass,
  textareaClass,
} from "./ui";

type Values = Record<string, unknown>;

export function ResourcePage({ resource }: { resource: Resource }) {
  const rows = useAdminRows<Row>(resource.table, `select=*&order=${resource.order}`);
  const write = useAdminWrite(resource.table);
  const [editing, setEditing] = useState<Values | null>(null);

  const togglePublished = async (r: Row) => {
    try {
      await write.save(r.id, { published: !r["published"] });
      toast.success(r["published"] ? "Hidden from the website." : "Published on the website.");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{resource.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{resource.intro}</p>
        </div>
        <Button onClick={() => setEditing({ ...resource.defaults })}>
          <Plus /> Add {resource.singular}
        </Button>
      </div>

      <Panel>
        {rows.isPending ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-7" />
          </div>
        ) : rows.isError ? (
          <ErrorBox message={errorMessage(rows.error)} />
        ) : !rows.data.length ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing here yet. The website shows a “coming soon” message until you add and publish
              the first {resource.singular}.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => setEditing({ ...resource.defaults })}
            >
              <Plus /> Add {resource.singular}
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {rows.data.map((r) => {
              const thumb = resource.thumb(r);
              const published = r["published"] !== false;
              const page = resource.publicPage?.(r);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-sm bg-muted">
                    {thumb && (
                      <img
                        src={storageUrl(thumb)}
                        alt=""
                        className="size-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 basis-[calc(100%-4.5rem)] sm:basis-0">
                    <p className="font-semibold truncate">
                      {resource.listTitle(r) || "(untitled)"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{resource.listMeta(r)}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {published ? "Published" : "Draft"}
                  </span>
                  <div className="ml-auto flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      title={published ? "Hide from website" : "Publish"}
                      aria-label={published ? "Hide from website" : "Publish"}
                      onClick={() => void togglePublished(r)}
                    >
                      {published ? <EyeOff /> : <Eye />}
                    </Button>
                    {page && published && (
                      <Button size="icon" variant="ghost" asChild title="View on website">
                        <a
                          href={`${import.meta.env.BASE_URL}${page}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on website"
                        >
                          <ExternalLink />
                        </a>
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Edit"
                      aria-label="Edit"
                      onClick={() => setEditing(r)}
                    >
                      <Pencil />
                    </Button>
                    <ConfirmDelete
                      title={`Delete this ${resource.singular}?`}
                      description="It will be removed from the website and the dashboard. This can't be undone."
                      onConfirm={() =>
                        void write
                          .destroy(r.id, resource.files(r))
                          .then(() => toast.success("Deleted."))
                          .catch((e) => toast.error(errorMessage(e)))
                      }
                    >
                      <Button size="icon" variant="ghost" title="Delete" aria-label="Delete">
                        <Trash2 className="text-destructive" />
                      </Button>
                    </ConfirmDelete>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Editor
        resource={resource}
        initial={editing}
        onClose={() => setEditing(null)}
        write={write}
      />
    </div>
  );
}

function Editor({
  resource,
  initial,
  onClose,
  write,
}: {
  resource: Resource;
  initial: Values | null;
  onClose: () => void;
  write: ReturnType<typeof useAdminWrite>;
}) {
  return (
    <Dialog open={!!initial} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92svh] overflow-y-auto rounded-sm sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initial?.["id"] ? `Edit ${resource.singular}` : `Add ${resource.singular}`}
          </DialogTitle>
          <DialogDescription>Fields marked * are required.</DialogDescription>
        </DialogHeader>
        {initial && (
          <EditorForm
            key={String(initial["id"] ?? "new")}
            resource={resource}
            initial={initial}
            onDone={onClose}
            write={write}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditorForm({
  resource,
  initial,
  onDone,
  write,
}: {
  resource: Resource;
  initial: Values;
  onDone: () => void;
  write: ReturnType<typeof useAdminWrite>;
}) {
  const [values, setValues] = useState<Values>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (name: string, v: unknown) => setValues((prev) => ({ ...prev, [name]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    for (const f of resource.fields) {
      const v = values[f.name];
      if (f.required && (v == null || (typeof v === "string" && !v.trim()))) {
        return setError(`Please fill in “${f.label}”.`);
      }
    }
    const row: Values = {};
    for (const f of resource.fields) {
      let v = values[f.name];
      if (f.type === "number") v = v === "" || v == null ? null : Number(v);
      else if (f.type === "checkbox") v = Boolean(v);
      else if (f.type === "images" || f.type === "urls")
        v = Array.isArray(v) ? v.filter(Boolean) : [];
      else if (typeof v === "string") v = v.trim() || null;
      if (f.type === "number" && v != null && !Number.isFinite(v))
        return setError(`“${f.label}” must be a number.`);
      row[f.name] = v ?? null;
    }
    setBusy(true);
    try {
      if (initial["id"]) await write.save(String(initial["id"]), row);
      else await write.create(row);
      toast.success("Saved.");
      onDone();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {resource.fields.map((f) => (
        <FieldInput
          key={f.name}
          field={f}
          folder={resource.table}
          value={values[f.name]}
          values={values}
          onChange={(v) => set(f.name, v)}
        />
      ))}
      <div className="sm:col-span-2 space-y-3">
        <ErrorBox message={error} />
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy && (
              <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" />
            )}
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}

function FieldInput({
  field: f,
  folder,
  value,
  values,
  onChange,
}: {
  field: FieldDef;
  folder: string;
  value: unknown;
  values: Values;
  onChange: (v: unknown) => void;
}) {
  const label = f.required ? `${f.label} *` : f.label;
  const span = f.half ? "" : "sm:col-span-2";
  const str = value == null ? "" : String(value);

  switch (f.type) {
    case "textarea":
      return (
        <Field label={label} hint={f.hint} className={span}>
          <textarea
            className={`${textareaClass} min-h-28`}
            value={str}
            maxLength={f.max}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
    case "select":
      return (
        <Field label={label} hint={f.hint} className={span}>
          <select className={inputClass} value={str} onChange={(e) => onChange(e.target.value)}>
            {f.options?.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      );
    case "checkbox":
      return (
        <label className={`flex items-center gap-3 text-sm font-semibold ${span}`}>
          <input
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          {f.label}
        </label>
      );
    case "images":
      return (
        <div className={span}>
          <ImagesInput
            label={label}
            hint={f.hint}
            folder={folder}
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={onChange}
          />
        </div>
      );
    case "image":
      return (
        <div className={span}>
          <ImagesInput
            label={label}
            hint={f.hint}
            folder={folder}
            single
            value={str ? [str] : []}
            onChange={(v) => onChange((v as string[])[0] ?? null)}
          />
        </div>
      );
    case "media":
      return values["media_type"] === "video" ? (
        <Field
          label={`Video link${f.required ? " *" : ""}`}
          hint="Paste a YouTube link (it plays on the page) or another video link."
          className={span}
        >
          <input
            className={inputClass}
            type="url"
            value={/^https?:/.test(str) ? str : ""}
            placeholder="https://www.youtube.com/watch?v=…"
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      ) : (
        <div className={span}>
          <ImagesInput
            label={`Photo${f.required ? " *" : ""}`}
            folder="gallery"
            single
            value={str && !/^https?:/.test(str) ? [str] : []}
            onChange={(v) => onChange((v as string[])[0] ?? null)}
          />
        </div>
      );
    case "urls":
      return (
        <Field label={label} hint={f.hint} className={span}>
          <textarea
            className={textareaClass}
            value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
            placeholder="https://www.youtube.com/watch?v=…"
            onChange={(e) => onChange(e.target.value.split(/\s*\n\s*/).map((s) => s.trim()))}
          />
        </Field>
      );
    default:
      return (
        <Field label={label} hint={f.hint} className={span}>
          <input
            className={inputClass}
            type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
            inputMode={f.type === "number" ? "decimal" : undefined}
            min={f.type === "number" ? 0 : undefined}
            step={f.type === "number" ? "any" : undefined}
            value={str}
            maxLength={f.max}
            placeholder={f.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      );
  }
}

function ImagesInput({
  label,
  hint,
  folder,
  value,
  onChange,
  single = false,
}: {
  label: string;
  hint?: string | undefined;
  folder: string;
  value: string[];
  onChange: (v: unknown) => void;
  single?: boolean;
}) {
  const upload = useUpload(folder);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const list = single ? [files[0]!] : Array.from(files);
    setBusy(list.length);
    const added: string[] = [];
    for (const file of list) {
      try {
        if (!file.type.startsWith("image/")) throw new Error(`“${file.name}” is not a photo.`);
        added.push(await upload(file));
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setBusy((n) => n - 1);
      }
    }
    onChange(single ? added.slice(0, 1) : [...value, ...added]);
  };
  const move = (i: number, d: number) => {
    const next = [...value];
    const [item] = next.splice(i, 1);
    next.splice(i + d, 0, item!);
    onChange(next);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((path, i) => (
          <div
            key={path}
            className="group relative aspect-square overflow-hidden rounded-sm bg-muted"
          >
            <img src={storageUrl(path)} alt="" className="size-full object-cover" />
            {!single && i === 0 && (
              <span className="absolute left-1 top-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                Cover
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 p-1">
              {!single && (
                <button
                  type="button"
                  className="rounded p-1 text-white disabled:opacity-30"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Move left"
                >
                  <ArrowLeft className="size-4" />
                </button>
              )}
              <button
                type="button"
                className="rounded p-1 text-white"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                aria-label="Remove photo"
              >
                <X className="size-4" />
              </button>
              {!single && (
                <button
                  type="button"
                  className="rounded p-1 text-white disabled:opacity-30"
                  disabled={i === value.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move right"
                >
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {(!single || value.length === 0) && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary">
            {busy > 0 ? <Spinner /> : <ImagePlus className="size-6" />}
            {busy > 0 ? "Uploading…" : single ? "Add photo" : "Add photos"}
            <input
              type="file"
              accept="image/*"
              multiple={!single}
              className="sr-only"
              disabled={busy > 0}
              onChange={(e) => {
                void add(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
