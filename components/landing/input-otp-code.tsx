import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface InputOTPCodeProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export default function InputOTPCode({ value, onChange }: InputOTPCodeProps) {
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={onChange} // ini trigger ketika user isi OTP
    >
      <InputOTPGroup className="space-x-2">
        {[...Array(6)].map((_, i) => (
          <InputOTPSlot
            key={i}
            index={i}
            className="bg-secondary rounded-md border-l border-accent shadow-none font-semibold"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
