import * as React from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  id?: string
}

interface CountryCode {
  code: string
  country: string
  flag: string
}

const countryCodes: CountryCode[] = [
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
]

function PhoneInput({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  className,
  disabled = false,
  required = false,
  id,
  ...props
}: PhoneInputProps) {
  // Parse the current value to extract country code and phone number
  const parsePhoneValue = (phoneValue: string): { countryCode: string; phoneNumber: string } => {
    if (!phoneValue) {
      return { countryCode: "+1", phoneNumber: "" }
    }

    // Find matching country code
    const matchingCountry = countryCodes.find(country => 
      phoneValue.startsWith(country.code)
    )

    if (matchingCountry) {
      return {
        countryCode: matchingCountry.code,
        phoneNumber: phoneValue.slice(matchingCountry.code.length)
      }
    }

    // Default to +1 if no match found
    return { countryCode: "+1", phoneNumber: phoneValue.replace(/^\+/, "") }
  }

  const { countryCode, phoneNumber } = parsePhoneValue(value)

  const handleCountryCodeChange = (newCountryCode: string) => {
    const newValue = newCountryCode + phoneNumber
    onChange?.(newValue)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Remove all non-digit characters
    const digitsOnly = inputValue.replace(/\D/g, "")
    
    // Limit to 10 digits
    const limitedDigits = digitsOnly.slice(0, 10)
    
    const newValue = countryCode + limitedDigits
    onChange?.(newValue)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {/* Country Code Selector */}
      <Select value={countryCode} onValueChange={handleCountryCodeChange} disabled={disabled}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{countryCodes.find(c => c.code === countryCode)?.flag}</span>
              <span>{countryCode}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.code}</span>
                <span className="text-sm text-gray-500">{country.country}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Phone Number Input */}
      <Input
        id={id}
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="flex-1"
        maxLength={10}
        {...props}
      />
    </div>
  )
}

export { PhoneInput } 