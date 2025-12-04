"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockStore, generateApprovalCode } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import { CheckCircle2, Download, CreditCard } from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const jobId = params.id as string;
  const [job, setJob] = useState(mockStore.jobs.findById(jobId));
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const currentJob = mockStore.jobs.findById(jobId);
    if (!currentJob) {
      router.push("/jobs");
      return;
    }
    setJob(currentJob);
  }, [jobId, router]);

  if (!job) {
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const approvalCode = generateApprovalCode();
      mockStore.jobs.update(job.id, {
        status: "paid",
        approvalCode,
        paidAt: new Date(),
      });

      const updatedJob = mockStore.jobs.findById(job.id);
      setJob(updatedJob || job);

      toast({
        title: "Payment Processed",
        description: `Approval code: ${approvalCode}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!job.approvalCode) return;

    try {
      const { generateReceiptPDF } = await import("@/lib/pdf-generator");
      const user = mockStore.users.findById(session?.user?.id || "");
      const pdfBytes = await generateReceiptPDF(
        user?.name || "Vendor",
        job.customerName,
        job.vehicleNo,
        job.amount,
        job.approvalCode,
        job.paidAt || job.createdAt
      );

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${job.approvalCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Receipt downloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Job Details</h1>
          <p className="text-gray-600">Job ID: {job.id}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Customer Name</p>
            <p className="text-lg font-medium">{job.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Vehicle Number</p>
            <p className="text-lg font-medium">{job.vehicleNo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-2xl font-bold">${job.amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-lg">{new Date(job.createdAt).toLocaleString()}</p>
          </div>
          {job.paidAt && (
            <div>
              <p className="text-sm text-muted-foreground">Paid At</p>
              <p className="text-lg">{new Date(job.paidAt).toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {job.approvalCode && (
        <Card>
          <CardHeader>
            <CardTitle>Approval Code</CardTitle>
            <CardDescription>Unique code for this job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md text-center">
              <p className="text-2xl font-mono font-bold">{job.approvalCode}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        {job.status === "pending" && (
          <Button onClick={handlePayment} disabled={isProcessing} size="lg" className="flex-1">
            <CreditCard className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Process Payment"}
          </Button>
        )}
        {job.status === "paid" && job.approvalCode && (
          <Button onClick={handleDownloadReceipt} size="lg" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        )}
        <Button variant="outline" onClick={() => router.push("/jobs")} size="lg">
          Back to Jobs
        </Button>
      </div>
    </div>
  );
}

