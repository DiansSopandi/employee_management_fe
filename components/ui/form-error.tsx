import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorsProps {
  message: string | undefined;
}

export const FormError = ({ message }: FormErrorsProps) => {
  if (!message) return null;

  return (
    <div className="flex text-center gap-x-2 text-sm p-3 rounded-md text-destructive bg-destructive/15">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
