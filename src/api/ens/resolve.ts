// API endpoint for resolving ENS names
// This would typically be a serverless function or API route

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    // In a real implementation, this would:
    // 1. Check if it's a valid address first
    // 2. If not, resolve the ENS name using the ENS registry
    // 3. For Rootstock, you might need to use a different ENS registry or resolver

    // For now, we'll simulate the resolution
    const mockResolutions: Record<string, string> = {
      "alice.vintara.eth": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      "bob.vintara.eth": "0x8ba1f109551bD432803012645Hac136c4c8b8b8",
      "charlie.vintara.eth": "0x1234567890123456789012345678901234567890",
      "diana.vintara.eth": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    };

    const resolvedAddress = mockResolutions[name.toLowerCase()];

    if (resolvedAddress) {
      return res.status(200).json({
        address: resolvedAddress,
        name: name,
        isENS: true,
      });
    }

    // If not found in our mock data, return error
    return res.status(404).json({ error: "ENS name not found" });
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
