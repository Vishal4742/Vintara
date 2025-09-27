// API endpoint for validating ENS names

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    // Basic ENS name validation
    const ensRegex =
      /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*\.eth$/;

    if (!ensRegex.test(name)) {
      return res.status(200).json({
        exists: false,
        valid: false,
        error: "Invalid ENS name format",
      });
    }

    // In a real implementation, this would:
    // 1. Check if the ENS name exists in the registry
    // 2. Verify the name is not expired
    // 3. Check if it has a resolver set

    // For now, we'll simulate validation
    const mockValidNames = [
      "alice.vintara.eth",
      "bob.vintara.eth",
      "charlie.vintara.eth",
      "diana.vintara.eth",
      "test.vintara.eth",
      "demo.vintara.eth",
    ];

    const exists = mockValidNames.includes(name.toLowerCase());

    return res.status(200).json({
      exists: exists,
      valid: true,
      name: name,
    });
  } catch (error) {
    console.error("Error validating ENS name:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
