import type { Metadata } from "next";
import { deleteOrphan } from "@/actions/admin-maintenance";
import { auditOrphanedStorage } from "@/lib/storage-audit";
export const metadata: Metadata = { title: "Maintenance" };
export default async function MaintenancePage() {
  const orphans = await auditOrphanedStorage();
  return <><div className="mb-8"><h1 className="font-display text-4xl font-black">Maintenance</h1><p className="mt-2 text-cream/70">Unreferenced Storage files older than 24 hours. Nothing is deleted automatically.</p></div><div className="grid gap-3">{orphans.map((item) => <div key={item.path} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-cream/15 p-4"><div><p className="break-all font-bold">{item.path}</p><p className="text-xs text-cream/55">{(item.size / 1024 / 1024).toFixed(2)} MB · {new Date(item.createdAt).toLocaleString()}</p></div><form action={deleteOrphan}><input type="hidden" name="path" value={item.path} /><button className="rounded-md bg-red-700 px-4 py-2 text-xs font-bold uppercase text-white">Delete orphan</button></form></div>)}{orphans.length === 0 ? <p className="rounded-lg border border-dashed border-cream/20 p-8 text-center text-cream/60">No old orphan files found.</p> : null}</div></>;
}
