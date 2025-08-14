"use client"

import { useEffect, useId, useState } from "react"
import { LoaderCircleIcon, MinusIcon, PlusIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NumberInputProps {
  label?: string
  placeholder?: string
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  required?: boolean
  className?: string
  showControls?: boolean
  formatOptions?: {
    style?: 'decimal' | 'currency' | 'percent'
    currency?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
}

export default function NumberInput({
  label = "Number input",
  placeholder = "Enter a number...",
  value = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  required = false,
  className = "",
  showControls = true,
  formatOptions
}: NumberInputProps) {
  const id = useId()
  const [inputValue, setInputValue] = useState(value.toString())
  const [displayValue, setDisplayValue] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setInputValue(value.toString())
    if (!isEditing) {
      setDisplayValue(formatDisplayValue(value.toString()))
    }
  }, [value, isEditing])

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
    setIsLoading(false)
  }, [inputValue])

  const validateAndUpdate = (newValue: string) => {
    setInputValue(newValue)
    setError("")

    if (newValue === "" || newValue === "-") {
      return
    }

    const numValue = parseFloat(newValue)
    
    if (isNaN(numValue)) {
      setError("Please enter a valid number")
      return
    }

    if (min !== undefined && numValue < min) {
      setError(`Value must be at least ${min}`)
      return
    }

    if (max !== undefined && numValue > max) {
      setError(`Value must be at most ${max}`)
      return
    }

    onChange?.(numValue)
  }

  const handleIncrement = () => {
    const currentValue = parseFloat(inputValue) || 0
    const newValue = currentValue + step
    if (max === undefined || newValue <= max) {
      validateAndUpdate(newValue.toString())
    }
  }

  const handleDecrement = () => {
    const currentValue = parseFloat(inputValue) || 0
    const newValue = currentValue - step
    if (min === undefined || newValue >= min) {
      validateAndUpdate(newValue.toString())
    }
  }

  const formatDisplayValue = (value: string) => {
    if (!formatOptions || value === "" || value === "-") return value
    
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return value

    try {
      return new Intl.NumberFormat('pt-BR', formatOptions).format(numValue)
    } catch {
      return value
    }
  }

  const parseCurrencyValue = (formattedValue: string): string => {
    if (!formatOptions || formatOptions.style !== 'currency') {
      return formattedValue.replace(/[^\d.-]/g, '')
    }

    const locale = 'pt-BR'
    const currency = formatOptions.currency || 'BRL'
    
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: formatOptions.minimumFractionDigits || 2,
      maximumFractionDigits: formatOptions.maximumFractionDigits || 2
    }).formatToParts(1234.56)

    const decimal = parts.find(part => part.type === 'decimal')?.value || '.'
    const group = parts.find(part => part.type === 'group')?.value || '.'
    const currencySymbol = parts.find(part => part.type === 'currency')?.value || 'R$'

    const cleanValue = formattedValue
      .replace(new RegExp(`\\${currencySymbol}`, 'g'), '')
      .replace(new RegExp(`\\${group}`, 'g'), '')
      .replace(new RegExp(`\\${decimal}`, 'g'), '.')
      .trim()

    if (cleanValue === '' || cleanValue === '-') {
      return cleanValue
    }

    const numValue = parseFloat(cleanValue)
    return isNaN(numValue) ? '' : numValue.toString()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (!formatOptions || formatOptions.style !== 'currency') {
      const rawValue = value.replace(/[^\d.-]/g, '')
      validateAndUpdate(rawValue)
      return
    }

    const rawValue = parseCurrencyValue(value)
    setDisplayValue(value)
    validateAndUpdate(rawValue)
  }

  const handleInputFocus = () => {
    setIsEditing(true)
    setDisplayValue(inputValue)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    if (inputValue && inputValue !== "-") {
      const numValue = parseFloat(inputValue)
      if (!isNaN(numValue)) {
        setInputValue(numValue.toString())
        setDisplayValue(formatDisplayValue(numValue.toString()))
      }
    }
  }

  return (
    <div className={`*:not-first:mt-2 ${className}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          className={`peer ${showControls ? 'ps-9 pe-9' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          placeholder={placeholder}
          type="text"
          value={isEditing ? displayValue : formatDisplayValue(inputValue)}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={disabled}
          required={required}
        />
        
        {showControls && (
          <>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (parseFloat(inputValue) || 0) <= min)}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 start-0 flex h-full w-9 items-center justify-center rounded-s-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease value"
            >
              <MinusIcon size={16} aria-hidden="true" />
            </button>
            
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (parseFloat(inputValue) || 0) >= max)}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase value"
            >
              <PlusIcon size={16} aria-hidden="true" />
            </button>
          </>
        )}

        {isLoading && (
          <div className="absolute inset-y-0 end-0 flex items-center justify-center pe-3">
            <LoaderCircleIcon
              className="animate-spin"
              size={16}
              role="status"
              aria-label="Loading..."
            />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
