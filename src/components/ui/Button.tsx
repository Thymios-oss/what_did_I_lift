import type { ButtonHTMLAttributes } from 'react'

/** `primary`: filled, for the main action. `secondary`: outlined, for everything else. */
type ButtonVariant = 'primary' | 'secondary'

/** Every normal `<button>` prop, plus the look. */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white active:bg-slate-700',
  secondary: 'border border-slate-300 bg-white text-slate-900 active:bg-slate-100',
}

/**
 * The app's button: at least 48px tall for easy tapping between sets.
 *
 * Defaults to `type="button"` so it never submits a form by accident; pass
 * `type="submit"` for the form's main action. Extra `className`s are appended.
 */
export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`min-h-12 rounded-lg px-4 font-semibold disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
