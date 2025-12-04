"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockStore } from "@/lib/mock-data";
import { useSession } from "next-auth/react";
import { CheckCircle2, XCircle, Users } from "lucide-react";

export default function VendorsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [vendors, setVendors] = useState(mockStore.users.getVendors());

  useEffect(() => {
    setVendors(mockStore.users.getVendors());
  }, []);

  // @ts-ignore
  if (session?.user?.role !== "admin") {
    return null;
  }

  const handleStatusChange = (vendorId: string, newStatus: "active" | "suspended") => {
    mockStore.users.update(vendorId, { status: newStatus });
    setVendors(mockStore.users.getVendors());
    toast({
      title: "Success",
      description: `Vendor ${newStatus === "active" ? "approved" : "suspended"}`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Vendor Management</h1>
        <p className="text-muted-foreground">Manage vendor accounts and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Vendors ({vendors.length})
          </CardTitle>
          <CardDescription>Approve, suspend, or manage vendor accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No vendors registered</p>
          ) : (
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined: {new Date(vendor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                        vendor.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vendor.status}
                    </span>
                    <div className="flex gap-2">
                      {vendor.status === "suspended" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(vendor.id, "active")}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(vendor.id, "suspended")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Suspend
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

