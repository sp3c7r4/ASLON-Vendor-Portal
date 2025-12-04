"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockStore } from "@/lib/mock-data";
import { useSession } from "next-auth/react";

export default function NewJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [customerName, setCustomerName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const job = mockStore.jobs.create({
        vendorId: session.user.id,
        customerName,
        vehicleNo,
        amount: 150.0, // Fixed fee
      });

      toast({
        title: "Success",
        description: "Job created successfully",
      });

      router.push(`/jobs/${job.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-black">Create New Job</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Enter customer and vehicle information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNo">Vehicle Number</Label>
              <Input
                id="vehicleNo"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                placeholder="ABC-1234"
                required
              />
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium">Service Fee: $150.00</p>
              <p className="text-xs text-muted-foreground mt-1">
                Payment will be processed after job creation
              </p>
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Job"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

