import { useState, type ReactNode } from "react";
import { BASE_CATEGORIES } from "@/lib/site-data";

export const inputClass =
  "w-full rounded-md border border-border bg-background/60 px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

export function Notice({ kind, children }: { kind: "error" | "ok" | "info"; children: ReactNode }) {
  const color =
    kind === "error"
      ? "text-destructive"
      : kind === "ok"
        ? "text-primary"
        : "text-muted-foreground";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`text-sm ${color}`}>
      {children}
    </p>
  );
}

const NEW = "__new__";

/** Category dropdown with the fixed list, any existing extra categories and "Categorie nouă…". */
export function CategoryPicker({
  value,
  onChange,
  extra,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  extra: string[];
  id?: string;
}) {
  const options = [...BASE_CATEGORIES, ...extra.filter((c) => !BASE_CATEGORIES.includes(c))];
  const [custom, setCustom] = useState(!options.includes(value) && value !== "");
  return (
    <div className="flex flex-col gap-2">
      <select
        id={id}
        className={inputClass}
        value={custom ? NEW : value}
        onChange={(e) => {
          if (e.target.value === NEW) {
            setCustom(true);
            onChange("");
          } else {
            setCustom(false);
            onChange(e.target.value);
          }
        }}
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value={NEW}>Categorie nouă…</option>
      </select>
      {custom && (
        <input
          className={inputClass}
          placeholder="Numele categoriei noi"
          value={value}
          maxLength={40}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Numele categoriei noi"
        />
      )}
    </div>
  );
}

export function friendlyError(error: unknown) {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : "";
  if (/ultimul administrator/i.test(msg)) return "Nu poți șterge ultimul administrator.";
  if (/row-level security|permission|not authorized|unauthorized|403/i.test(msg))
    return "Nu ai permisiunea pentru această acțiune. Încearcă să te autentifici din nou.";
  if (/duplicate key/i.test(msg)) return "Această adresă există deja în listă.";
  if (/payload too large|exceeded|size/i.test(msg)) return "Fișierul este prea mare.";
  if (/fetch|network/i.test(msg))
    return "Nu există conexiune la internet. Verifică rețeaua și încearcă din nou.";
  return "A apărut o eroare. Încearcă din nou.";
}

/** Re-encodes a photo into a JPEG of at most `width` px; drawing to canvas drops EXIF/GPS. */
export async function resizeImage(file: File, width: number, quality = 0.82) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, width / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const ratio = bitmap.width / bitmap.height;
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", quality),
  );
  return { blob, ratio };
}
