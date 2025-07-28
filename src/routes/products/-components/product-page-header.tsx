import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductPageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Product Inventory
        </h1>
        <p className="text-muted-foreground">
          Manage and view your product inventory with real-time data
        </p>
      </div>
      <Button asChild>
        <Link to="/products/new" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </Button>
    </div>
  );
}
