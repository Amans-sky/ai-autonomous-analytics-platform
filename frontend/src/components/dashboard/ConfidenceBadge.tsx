import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

interface ConfidenceBadgeProps {
  confidence: number;
  className?: string;
}

/**
 * Displays a confidence score badge with color coding
 * High (>=0.8): Green
 * Medium (>=0.5): Yellow/Amber
 * Low (<0.5): Red
 */
const ConfidenceBadge = ({ confidence, className }: ConfidenceBadgeProps) => {
  const percentage = Math.round(confidence * 100);

  const getVariant = () => {
    if (confidence >= 0.8) {
      return {
        bgClass: "bg-chart-2/10 border-chart-2/30",
        textClass: "text-chart-2",
        Icon: ShieldCheck,
        label: "High Confidence",
      };
    }
    if (confidence >= 0.5) {
      return {
        bgClass: "bg-chart-4/10 border-chart-4/30",
        textClass: "text-chart-4",
        Icon: ShieldQuestion,
        label: "Medium Confidence",
      };
    }
    return {
      bgClass: "bg-destructive/10 border-destructive/30",
      textClass: "text-destructive",
      Icon: ShieldAlert,
      label: "Low Confidence",
    };
  };

  const { bgClass, textClass, Icon, label } = getVariant();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
        bgClass,
        className
      )}
    >
      <Icon className={cn("h-4 w-4", textClass)} />
      <span className={cn("text-sm font-medium", textClass)}>
        {percentage}%
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export default ConfidenceBadge;
