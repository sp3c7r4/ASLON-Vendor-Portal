import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { mockStore } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function JobsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "vendor") {
    redirect("/login");
  }

  const jobs = mockStore.jobs.getByVendorId(session.user.id || "");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-muted-foreground">Manage your speedlimiter jobs</p>
        </div>
        <Link href="/jobs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No jobs yet</p>
            <Link href="/jobs/new">
              <Button>Create Your First Job</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{job.customerName}</CardTitle>
                    <CardDescription>{job.vehicleNo}</CardDescription>
                  </div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      job.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : job.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(job.createdAt).toLocaleString()}
                    </p>
                    {job.approvalCode && (
                      <p className="text-sm font-mono font-medium">Code: {job.approvalCode}</p>
                    )}
                    <p className="text-lg font-bold">${job.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    {job.status === "paid" && (
                      <Link href={`/jobs/${job.id}/receipt`}>
                        <Button variant="outline">Download Receipt</Button>
                      </Link>
                    )}
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

