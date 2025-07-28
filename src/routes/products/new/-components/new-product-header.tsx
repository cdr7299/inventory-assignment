import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewProductHeaderProps {
  onBack: () => void;
}

export function NewProductHeader({ onBack }: NewProductHeaderProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Add New Product
        </h1>
        <p className="text-muted-foreground">
          Create a new product entry for your inventory
        </p>
      </motion.div>
    </>
  );
}
