import { useId, type InputHTMLAttributes } from 'react'

/** Every normal `<input>` prop, plus the visible label text. */
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

/**
 * A text field with its label above it, 48px tall for easy tapping.
 *
 * The label is linked to the field (tapping it focuses the field, and screen
 * readers announce it). `className` styles the wrapper, e.g. its width.
 */
export function Input({ label, className = '', ...props }: InputProps) {
  const id = useId()
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm text-slate-600">
        {label}
      </label>
      <input
        id={id}
        className="min-h-12 w-full rounded-lg border border-slate-300 px-3 text-lg"
        {...props}
      />
    </div>
  )
}
