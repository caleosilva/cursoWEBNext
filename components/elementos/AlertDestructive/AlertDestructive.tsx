import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface AlertDestructiveProps {
    titulo:string;
    descricao: string;
}

export default function AlertDestructive({titulo, descricao}: AlertDestructiveProps) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{titulo}</AlertTitle>
      <AlertDescription>
        {descricao}
      </AlertDescription>
    </Alert>
  )
}
