import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { mockStore } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, FileText, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();

  // @ts-ignore
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const vendors = mockStore.users.getVendors();
  const allJobs = mockStore.jobs.getAll();
  const announcements = mockStore.announcements.getAll().slice(0, 5);

  const stats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter((v) => v.status === "active").length,
    suspendedVendors: vendors.filter((v) => v.status === "suspended").length,
    totalRevenue: allJobs
      .filter((j) => j.status === "paid" || j.status === "completed")
      .reduce((sum, j) => sum + j.amount, 0),
    totalJobs: allJobs.length,
    pendingJobs: allJobs.filter((j) => j.status === "pending").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-600">Manage vendors, jobs, and system settings</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeVendors} active, {stats.suspendedVendors} suspended
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingJobs} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">Active announcements</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments & Transactions</CardTitle>
          <CardDescription>All payment records and job transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {allJobs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No payments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-sm">Job ID</th>
                    <th className="text-left p-3 font-medium text-sm">Vendor</th>
                    <th className="text-left p-3 font-medium text-sm">Customer</th>
                    <th className="text-left p-3 font-medium text-sm">Vehicle No</th>
                    <th className="text-left p-3 font-medium text-sm">Amount</th>
                    <th className="text-left p-3 font-medium text-sm">Status</th>
                    <th className="text-left p-3 font-medium text-sm">Approval Code</th>
                    <th className="text-left p-3 font-medium text-sm">Date</th>
                    <th className="text-left p-3 font-medium text-sm">Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {allJobs
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((job) => {
                      const vendor = mockStore.users.findById(job.vendorId);
                      return (
                        <tr key={job.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 text-sm font-mono">{job.id.slice(0, 8)}...</td>
                          <td className="p-3 text-sm">{vendor?.name || "Unknown"}</td>
                          <td className="p-3 text-sm">{job.customerName}</td>
                          <td className="p-3 text-sm font-mono">{job.vehicleNo}</td>
                          <td className="p-3 text-sm font-semibold">${job.amount.toFixed(2)}</td>
                          <td className="p-3">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                job.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : job.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm font-mono">
                            {job.approvalCode || (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {job.paidAt ? new Date(job.paidAt).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Management</CardTitle>
            <CardDescription>Manage vendor accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No vendors registered</p>
              ) : (
                vendors.slice(0, 5).map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-sm text-muted-foreground">{vendor.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          vendor.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {vendors.length > 5 && (
                <Link href="/dashboard/admin/vendors" className="block text-center text-sm text-primary hover:underline">
                  View all vendors
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest system announcements</CardDescription>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No announcements</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="border-b pb-4 last:border-0">
                    <h4 className="font-medium">{ann.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

