// API endpoint for reverse ENS resolution (address to name)

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    // In a real implementation, this would:
    // 1. Validate the address format
    // 2. Query the ENS registry for reverse resolution
    // 3. Return the associated ENS name if found

    // For now, we'll simulate the reverse resolution
    const mockReverseResolutions: Record<string, string> = {
      "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6": "alice.vintara.eth",
      "0x8ba1f109551bD432803012645Hac136c4c8b8b8": "bob.vintara.eth",
      "0x1234567890123456789012345678901234567890": "charlie.vintara.eth",
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": "diana.vintara.eth",
    };

    const ensName = mockReverseResolutions[address.toLowerCase()];

    if (ensName) {
      return res.status(200).json({
        name: ensName,
        address: address,
        isENS: true,
      });
    }

    // If no ENS name found, return null
    return res.status(200).json({
      name: null,
      address: address,
      isENS: false,
    });
  } catch (error) {
    console.error("Error reverse resolving ENS:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
