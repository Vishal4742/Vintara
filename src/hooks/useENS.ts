import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract } from "wagmi";
import { isAddress } from "viem";

// ENS Resolver contract ABI (simplified)
const ENS_RESOLVER_ABI = [
  {
    inputs: [{ name: "nameHash", type: "bytes32" }],
    name: "resolveENSName",
    outputs: [{ name: "addr", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "name", type: "string" }],
    name: "resolveENSNameString",
    outputs: [{ name: "addr", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "addr", type: "address" }],
    name: "getENSNameForAddress",
    outputs: [{ name: "nameHash", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "nameHash", type: "bytes32" }],
    name: "isENSSupported",
    outputs: [{ name: "isSupported", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "nameOrAddress", type: "string" }],
    name: "resolveNameOrAddress",
    outputs: [{ name: "addr", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Contract addresses (these would be the deployed contract addresses)
const ENS_RESOLVER_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual address

export interface ENSResult {
  address: string | null;
  name: string | null;
  isENS: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useENS() {
  const { address } = useAccount();
  const [ensResult, setEnsResult] = useState<ENSResult>({
    address: null,
    name: null,
    isENS: false,
    isLoading: false,
    error: null,
  });

  // Resolve ENS name to address
  const resolveENSName = useCallback(
    async (name: string): Promise<string | null> => {
      if (!name) return null;

      try {
        // Check if it's already a valid address
        if (isAddress(name)) {
          return name;
        }

        // Try to resolve as ENS name
        const result = await fetch("/api/ens/resolve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        if (!result.ok) {
          throw new Error("Failed to resolve ENS name");
        }

        const data = await result.json();
        return data.address;
      } catch (error) {
        console.error("Error resolving ENS name:", error);
        return null;
      }
    },
    []
  );

  // Get ENS name for address
  const getENSNameForAddress = useCallback(
    async (addr: string): Promise<string | null> => {
      if (!addr || !isAddress(addr)) return null;

      try {
        const result = await fetch("/api/ens/reverse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address: addr }),
        });

        if (!result.ok) {
          return null;
        }

        const data = await result.json();
        return data.name;
      } catch (error) {
        console.error("Error getting ENS name:", error);
        return null;
      }
    },
    []
  );

  // Resolve name or address
  const resolveNameOrAddress = useCallback(
    async (input: string): Promise<ENSResult> => {
      setEnsResult((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        if (!input.trim()) {
          setEnsResult({
            address: null,
            name: null,
            isENS: false,
            isLoading: false,
            error: null,
          });
          return ensResult;
        }

        // Check if it's a valid address
        if (isAddress(input)) {
          const ensName = await getENSNameForAddress(input);
          setEnsResult({
            address: input,
            name: ensName,
            isENS: !!ensName,
            isLoading: false,
            error: null,
          });
          return {
            address: input,
            name: ensName,
            isENS: !!ensName,
            isLoading: false,
            error: null,
          };
        }

        // Try to resolve as ENS name
        const resolvedAddress = await resolveENSName(input);
        if (resolvedAddress) {
          setEnsResult({
            address: resolvedAddress,
            name: input,
            isENS: true,
            isLoading: false,
            error: null,
          });
          return {
            address: resolvedAddress,
            name: input,
            isENS: true,
            isLoading: false,
            error: null,
          };
        }

        // If neither worked
        setEnsResult({
          address: null,
          name: null,
          isENS: false,
          isLoading: false,
          error: "Invalid address or ENS name not found",
        });
        return {
          address: null,
          name: null,
          isENS: false,
          isLoading: false,
          error: "Invalid address or ENS name not found",
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setEnsResult({
          address: null,
          name: null,
          isENS: false,
          isLoading: false,
          error: errorMessage,
        });
        return {
          address: null,
          name: null,
          isENS: false,
          isLoading: false,
          error: errorMessage,
        };
      }
    },
    [resolveENSName, getENSNameForAddress, ensResult]
  );

  // Get current user's ENS name
  const getCurrentUserENS = useCallback(async () => {
    if (!address) return null;
    return await getENSNameForAddress(address);
  }, [address, getENSNameForAddress]);

  return {
    ...ensResult,
    resolveNameOrAddress,
    resolveENSName,
    getENSNameForAddress,
    getCurrentUserENS,
  };
}

// Hook for ENS name validation
export function useENSValidation() {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateENSName = useCallback(
    async (name: string): Promise<boolean> => {
      if (!name) {
        setIsValid(false);
        return false;
      }

      setIsLoading(true);

      try {
        // Basic ENS name validation
        const ensRegex =
          /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.eth$/;

        if (!ensRegex.test(name)) {
          setIsValid(false);
          setIsLoading(false);
          return false;
        }

        // Check if ENS name exists
        const result = await fetch("/api/ens/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        const data = await result.json();
        const valid = data.exists;

        setIsValid(valid);
        setIsLoading(false);
        return valid;
      } catch (error) {
        console.error("Error validating ENS name:", error);
        setIsValid(false);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  return {
    isValid,
    isLoading,
    validateENSName,
  };
}
