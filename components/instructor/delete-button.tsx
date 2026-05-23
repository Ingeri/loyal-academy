"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteButtonProps {
  url: string;
}

export default function DeleteButton({ url }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      setIsDeleting(true);
      try {
        await fetch(url, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (error) {
        console.error("Delete error:", error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
