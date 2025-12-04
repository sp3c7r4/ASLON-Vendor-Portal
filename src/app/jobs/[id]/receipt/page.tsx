"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockStore } from "@/lib/mock-data";
import { useSession } from "next-auth/react";

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const jobId = params.id as string;

  useEffect(() => {
    const job = mockStore.jobs.findById(jobId);
    if (!job || !job.approvalCode) {
      router.push(`/jobs/${jobId}`);
      return;
    }

    const downloadReceipt = async () => {
      try {
        const { generateReceiptPDF } = await import("@/lib/pdf-generator");
        const user = mockStore.users.findById(session?.user?.id || "");
        const pdfBytes = await generateReceiptPDF(
          user?.name || "Vendor",
          job.customerName,
          job.vehicleNo,
          job.amount,
          job.approvalCode!,
          job.paidAt || job.createdAt
        );

        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt-${job.approvalCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        router.push(`/jobs/${jobId}`);
      } catch (error) {
        console.error("Error generating receipt:", error);
        router.push(`/jobs/${jobId}`);
      }
    };

    downloadReceipt();
  }, [jobId, router, session]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Generating receipt...</p>
    </div>
  );
}

