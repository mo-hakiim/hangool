import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { insert, remove, removeFile, select, update, uploadImage } from "@/lib/supabase";
import { useAdminAuth } from "./auth";
import { prepareImage } from "./ui";

export type Row = Record<string, unknown> & { id: string };

/** Rows straight from Supabase with the admin's token (drafts included). */
export function useAdminRows<T = Row>(table: string, query: string) {
  const { token } = useAdminAuth();
  return useQuery({
    queryKey: ["admin", table, query],
    queryFn: async () => select<T>(table, query, await token()),
    staleTime: 0,
  });
}

/** Insert / update / delete helpers that refresh the admin and public caches afterwards. */
export function useAdminWrite(table: string) {
  const { token } = useAdminAuth();
  const qc = useQueryClient();
  const refresh = useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["admin", table] });
    void qc.invalidateQueries({ queryKey: ["public", table] });
  }, [qc, table]);

  return {
    create: async (row: Record<string, unknown>) => {
      const out = await insert<Row>(table, row, await token());
      refresh();
      return out;
    },
    save: async (id: string, patch: Record<string, unknown>) => {
      const out = await update<Row>(table, id, patch, await token());
      refresh();
      return out;
    },
    destroy: async (id: string, files: string[] = []) => {
      const t = await token();
      await remove(table, id, t);
      // Best effort: remove the row's photos from storage too.
      await Promise.all(
        files.filter((f) => f && !/^https?:/.test(f)).map((f) => removeFile(f, t).catch(() => {})),
      );
      refresh();
    },
    refresh,
  };
}

/** Shrinks and uploads a photo; returns its path in the site-media bucket. */
export function useUpload(folder: string) {
  const { token } = useAdminAuth();
  return async (file: File) => {
    const blob = await prepareImage(file);
    const ext =
      blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return uploadImage(`${folder}/${id}.${ext}`, blob, await token());
  };
}
