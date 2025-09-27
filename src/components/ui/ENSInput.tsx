import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { Alert, AlertDescription } from "./alert";
import { Loader2, Check, X, ExternalLink } from "lucide-react";
import { useENS, useENSValidation } from "@/hooks/useENS";
import { cn } from "@/lib/utils";

interface ENSInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressResolved?: (address: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showValidation?: boolean;
  label?: string;
  description?: string;
}

export function ENSInput({
  value,
  onChange,
  onAddressResolved,
  placeholder = "Enter ENS name or address (e.g., user.vintara.eth)",
  className,
  disabled = false,
  showValidation = true,
  label = "Recipient",
  description,
}: ENSInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { resolveNameOrAddress, isLoading, error } = useENS();
  const {
    validateENSName,
    isValid,
    isLoading: isValidating,
  } = useENSValidation();

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Resolve ENS name when debounced value changes
  useEffect(() => {
    if (debouncedValue && debouncedValue !== value) {
      resolveNameOrAddress(debouncedValue).then((result) => {
        if (result.address && onAddressResolved) {
          onAddressResolved(result.address);
        }
      });
    }
  }, [debouncedValue, value, resolveNameOrAddress, onAddressResolved]);

  // Validate ENS name
  useEffect(() => {
    if (debouncedValue && showValidation) {
      validateENSName(debouncedValue);
    }
  }, [debouncedValue, showValidation, validateENSName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const getValidationStatus = () => {
    if (isValidating || isLoading) return "loading";
    if (error) return "error";
    if (isValid === true) return "valid";
    if (isValid === false && debouncedValue) return "invalid";
    return "neutral";
  };

  const validationStatus = getValidationStatus();

  const getStatusIcon = () => {
    switch (validationStatus) {
      case "loading":
        return (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        );
      case "valid":
        return <Check className="h-4 w-4 text-green-500" />;
      case "invalid":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case "valid":
        return "border-green-500 focus:border-green-500";
      case "invalid":
        return "border-red-500 focus:border-red-500";
      case "error":
        return "border-red-500 focus:border-red-500";
      default:
        return "";
    }
  };

  // Common ENS suggestions
  const suggestions = [
    "alice.vintara.eth",
    "bob.vintara.eth",
    "charlie.vintara.eth",
    "diana.vintara.eth",
  ].filter((suggestion) =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="relative">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pr-10", getStatusColor())}
          />

          {showValidation && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getStatusIcon()}
            </div>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1">
            <CardContent className="p-2">
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto p-2"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        ENS
                      </Badge>
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Validation feedback */}
      {showValidation && debouncedValue && (
        <div className="space-y-1">
          {validationStatus === "valid" && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Valid ENS name</span>
            </div>
          )}

          {validationStatus === "invalid" && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertDescription>
                Invalid ENS name format or name not found
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Resolved address display */}
      {debouncedValue && validationStatus === "valid" && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Resolved Address</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {debouncedValue.includes(".eth")
                    ? "Resolving..."
                    : debouncedValue}
                </p>
              </div>
              {debouncedValue.includes(".eth") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    // Open in block explorer
                    const explorerUrl = `https://explorer.testnet.rsk.co/address/${debouncedValue}`;
                    window.open(explorerUrl, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ENS Address Display Component
interface ENSAddressDisplayProps {
  address: string;
  ensName?: string;
  showCopy?: boolean;
  showExplorer?: boolean;
  className?: string;
}

export function ENSAddressDisplay({
  address,
  ensName,
  showCopy = true,
  showExplorer = true,
  className,
}: ENSAddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const handleExplorerClick = () => {
    const explorerUrl = `https://explorer.testnet.rsk.co/address/${address}`;
    window.open(explorerUrl, "_blank");
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex-1 min-w-0">
        {ensName ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                ENS
              </Badge>
              <span className="text-sm font-medium">{ensName}</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground truncate">
              {address}
            </p>
          </div>
        ) : (
          <p className="text-sm font-mono">{address}</p>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {showCopy && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
          </Button>
        )}

        {showExplorer && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleExplorerClick}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
