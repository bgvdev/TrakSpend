import { cn } from "@/lib/cn";
import { IconButton } from "./Button";
import Field from "./Field";
import Input from "./Input";

interface DateRangeInputsProps {
  /** Prefix for the two input ids, so each label stays tied to its own input. */
  idPrefix: string;
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
  className?: string;
}

/** From/To date pickers with a button between them that swaps the two. */
export default function DateRangeInputs({ idPrefix, from, to, onChange, className }: DateRangeInputsProps) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-1.5", className)}>
      <Field label="From" htmlFor={`${idPrefix}-from`}>
        <Input
          id={`${idPrefix}-from`}
          type="date"
          size="sm"
          value={from ?? ""}
          onChange={(e) => onChange(e.target.value || null, to)}
        />
      </Field>
      <IconButton
        icon="swap_horiz"
        label="Swap from and to dates"
        size="sm"
        className="h-8 w-8"
        disabled={from === to}
        onClick={() => onChange(to, from)}
      />
      <Field label="To" htmlFor={`${idPrefix}-to`}>
        <Input
          id={`${idPrefix}-to`}
          type="date"
          size="sm"
          value={to ?? ""}
          onChange={(e) => onChange(from, e.target.value || null)}
        />
      </Field>
    </div>
  );
}
