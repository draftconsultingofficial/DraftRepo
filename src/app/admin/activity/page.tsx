import { requireMainAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AuditLogModel } from "@/models/AuditLog";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ActivityLogPage() {
  await requireMainAdmin();
  await connectToDatabase();

  const logs = await AuditLogModel.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          Security
        </p>
        <h1 className="mt-2 font-semibold text-4xl text-gray-900">
          Activity Log
        </h1>
        <p className="mt-3 text-base text-gray-600">
          Monitor system actions, user access modifications, and content updates continuously.
        </p>
      </div>

      <div className="admin-card overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-900 border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Action</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length > 0 ? (
              logs.map((log: any) => (
                <tr key={String(log._id)} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-gray-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {log.performedBy}
                  </td>
                  <td className="px-6 py-4">
                    {log.details}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No activity logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
