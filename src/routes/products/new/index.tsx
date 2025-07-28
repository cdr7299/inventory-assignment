import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNewProductForm } from "@/hooks";
import { NewProductHeader } from "@/routes/products/new/-components/new-product-header";
import { NewProductForm } from "@/routes/products/new/-components/new-product-form";

export const Route = createFileRoute("/products/new/")({
  component: AddProductPage,
});

function AddProductPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: "/products" });
  };

  const handleBack = () => {
    navigate({ to: "/products" });
  };

  const { form, isPending, onSubmit } = useNewProductForm({
    onSuccess: handleSuccess,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <NewProductHeader onBack={handleBack} />
      <NewProductForm
        form={form}
        isPending={isPending}
        onSubmit={onSubmit}
        onCancel={handleBack}
      />
    </div>
  );
}
