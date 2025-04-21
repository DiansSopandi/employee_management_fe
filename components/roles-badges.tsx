// components/RolesBadges.tsx
import { Badge } from "@/components/ui/badge";

interface RolesBadgesProps {
  roles: string[];
}

export const RolesBadges = ({ roles }: RolesBadgesProps) => {
  return (
    <div className="flex gap-1">
      {roles.map((role: string) => (
        <Badge key={role} variant="outline" className="bg-blue-50">
          {role}
        </Badge>
      ))}
    </div>
  );
};
