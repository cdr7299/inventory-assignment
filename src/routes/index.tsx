import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="text-center">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Welcome to Inventory Manager
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Manage your product inventory with ease. View, search, filter, and
            organize your products efficiently.
          </p>
        </div>
        <div className="flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link to="/products">View Products</Link>
          </Button>
        </div>
      </div>
    </div>
  ),
});
