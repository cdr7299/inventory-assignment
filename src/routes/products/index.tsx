import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/products/")({
  component: () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Product Inventory
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage and view your product inventory
        </p>
      </div>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-xl">Inventory Table Coming Soon</CardTitle>
          <CardDescription>
            The product inventory table will be displayed here with search,
            filter, and sorting capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Features will include: debounced search, category filtering,
            price/stock sorting, and pagination.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
});
