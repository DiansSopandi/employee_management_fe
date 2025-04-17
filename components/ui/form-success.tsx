import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormSuccessProps {
  message: string | undefined;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="flex text-center gap-x-2 text-sm p-3 rounded-md text-emerald-500 bg-emerald-500/15">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
