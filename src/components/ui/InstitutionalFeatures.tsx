import { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Alert, AlertDescription } from "./alert";
import { Progress } from "./progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Building2,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  PieChart,
  Activity,
  Clock,
} from "lucide-react";

interface InstitutionalProduct {
  id: string;
  name: string;
  description: string;
  category: "treasury" | "lending" | "yield" | "derivatives";
  minInvestment: number;
  maxInvestment: number;
  apy: number;
  risk: "low" | "medium" | "high";
  lockPeriod: number;
  features: string[];
  requirements: string[];
  status: "available" | "coming-soon" | "whitelist";
}

interface InstitutionalClient {
  id: string;
  name: string;
  type: "hedge-fund" | "family-office" | "corporation" | "pension-fund";
  aum: number;
  status: "active" | "pending" | "suspended";
  joinDate: string;
  totalInvested: number;
  currentYield: number;
}

export function InstitutionalFeatures() {
  const [selectedProduct, setSelectedProduct] = useState<string>("treasury");
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);

  const institutionalProducts: InstitutionalProduct[] = [
    {
      id: "treasury-management",
      name: "Institutional Treasury Management",
      description:
        "Professional-grade treasury management with automated yield optimization and risk management.",
      category: "treasury",
      minInvestment: 1000000,
      maxInvestment: 100000000,
      apy: 18.5,
      risk: "low",
      lockPeriod: 90,
      features: [
        "Automated yield optimization",
        "Risk-adjusted portfolio management",
        "Real-time reporting and analytics",
        "Dedicated account manager",
        "Custom investment strategies",
        "Regulatory compliance support",
      ],
      requirements: [
        "Minimum $1M investment",
        "KYC/AML verification",
        "Institutional accreditation",
        "Signed service agreement",
      ],
      status: "available",
    },
    {
      id: "prime-lending",
      name: "Prime Lending Facility",
      description:
        "Exclusive lending facility with preferential rates and terms for institutional clients.",
      category: "lending",
      minInvestment: 5000000,
      maxInvestment: 500000000,
      apy: 12.8,
      risk: "low",
      lockPeriod: 30,
      features: [
        "Preferential interest rates",
        "Flexible collateral options",
        "Custom loan terms",
        "Priority liquidation protection",
        "Dedicated support team",
        "Advanced risk management",
      ],
      requirements: [
        "Minimum $5M investment",
        "Institutional credit rating",
        "Collateral verification",
        "Legal entity documentation",
      ],
      status: "available",
    },
    {
      id: "yield-strategies",
      name: "Advanced Yield Strategies",
      description:
        "Sophisticated yield farming strategies with institutional-grade risk management.",
      category: "yield",
      minInvestment: 2000000,
      maxInvestment: 200000000,
      apy: 35.2,
      risk: "medium",
      lockPeriod: 180,
      features: [
        "Multi-strategy yield farming",
        "Dynamic risk adjustment",
        "Liquidity mining optimization",
        "Cross-chain yield opportunities",
        "Performance-based fees",
        "Quarterly strategy reviews",
      ],
      requirements: [
        "Minimum $2M investment",
        "Risk tolerance assessment",
        "Investment policy alignment",
        "Regular performance reviews",
      ],
      status: "available",
    },
    {
      id: "derivatives-trading",
      name: "DeFi Derivatives Trading",
      description:
        "Advanced derivatives trading with institutional-grade infrastructure and risk controls.",
      category: "derivatives",
      minInvestment: 10000000,
      maxInvestment: 1000000000,
      apy: 45.8,
      risk: "high",
      lockPeriod: 0,
      features: [
        "Options and futures trading",
        "Leveraged positions",
        "Advanced order types",
        "Real-time risk monitoring",
        "Custom derivative products",
        "Prime brokerage services",
      ],
      requirements: [
        "Minimum $10M investment",
        "Derivatives trading experience",
        "Risk management certification",
        "Regulatory compliance",
      ],
      status: "coming-soon",
    },
  ];

  const institutionalClients: InstitutionalClient[] = [
    {
      id: "client-1",
      name: "Alpha Capital Management",
      type: "hedge-fund",
      aum: 2500000000,
      status: "active",
      joinDate: "2024-01-15",
      totalInvested: 45000000,
      currentYield: 22.3,
    },
    {
      id: "client-2",
      name: "Wellington Family Office",
      type: "family-office",
      aum: 1200000000,
      status: "active",
      joinDate: "2024-02-03",
      totalInvested: 28000000,
      currentYield: 18.7,
    },
    {
      id: "client-3",
      name: "TechCorp Treasury",
      type: "corporation",
      aum: 5000000000,
      status: "active",
      joinDate: "2024-01-28",
      totalInvested: 125000000,
      currentYield: 15.2,
    },
    {
      id: "client-4",
      name: "Global Pension Fund",
      type: "pension-fund",
      aum: 15000000000,
      status: "pending",
      joinDate: "2024-03-01",
      totalInvested: 0,
      currentYield: 0,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "treasury":
        return <Building2 className="h-5 w-5" />;
      case "lending":
        return <DollarSign className="h-5 w-5" />;
      case "yield":
        return <TrendingUp className="h-5 w-5" />;
      case "derivatives":
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-success border-success bg-success/10";
      case "medium":
        return "text-warning border-warning bg-warning/10";
      case "high":
        return "text-destructive border-destructive bg-destructive/10";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-success border-success bg-success/10";
      case "coming-soon":
        return "text-warning border-warning bg-warning/10";
      case "whitelist":
        return "text-bitcoin border-bitcoin bg-bitcoin/10";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case "hedge-fund":
        return <TrendingUp className="h-4 w-4" />;
      case "family-office":
        return <Users className="h-4 w-4" />;
      case "corporation":
        return <Building2 className="h-4 w-4" />;
      case "pension-fund":
        return <Shield className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Institutional DeFi</h2>
          <p className="text-muted-foreground">
            Professional-grade DeFi solutions for institutional investors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-bitcoin border-bitcoin">
            <Shield className="h-3 w-3 mr-1" />
            Institutional Grade
          </Badge>
          <Badge variant="outline" className="text-success border-success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Regulated
          </Badge>
        </div>
      </div>

      {/* Institutional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">Total AUM</span>
            </div>
            <div className="text-2xl font-bold">$2.3B</div>
            <div className="text-xs text-success">+15.2% this quarter</div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Institutional Clients
              </span>
            </div>
            <div className="text-2xl font-bold">47</div>
            <div className="text-xs text-success">+8 this month</div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">Average APY</span>
            </div>
            <div className="text-2xl font-bold">24.7%</div>
            <div className="text-xs text-success">+2.1% vs market</div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Security Score
              </span>
            </div>
            <div className="text-2xl font-bold">98.5%</div>
            <div className="text-xs text-success">AAA Rating</div>
          </div>
        </Card>
      </div>

      {/* Institutional Products */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Institutional Products</h3>
            <Dialog
              open={showWhitelistModal}
              onOpenChange={setShowWhitelistModal}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Apply for Whitelist
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Institutional Whitelist Application</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Institution Name
                      </label>
                      <Input placeholder="Enter institution name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Institution Type
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hedge-fund">Hedge Fund</SelectItem>
                          <SelectItem value="family-office">
                            Family Office
                          </SelectItem>
                          <SelectItem value="corporation">
                            Corporation
                          </SelectItem>
                          <SelectItem value="pension-fund">
                            Pension Fund
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Assets Under Management
                    </label>
                    <Input placeholder="Enter AUM amount" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Investment Amount
                    </label>
                    <Input placeholder="Enter investment amount" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Contact Information
                    </label>
                    <Input placeholder="Enter contact email" />
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      All applications are subject to review and approval. You
                      will be contacted within 2-3 business days.
                    </AlertDescription>
                  </Alert>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowWhitelistModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" variant="bitcoin">
                      Submit Application
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {institutionalProducts.map((product) => (
              <div
                key={product.id}
                className="p-6 rounded-lg bg-secondary/30 border border-border/40"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(product.category)}
                        <h4 className="text-lg font-semibold">
                          {product.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={getRiskColor(product.risk)}
                        >
                          {product.risk} risk
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getStatusColor(product.status)}
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground max-w-2xl">
                        {product.description}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-bitcoin">
                        {product.apy}% APY
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Min: {formatCurrency(product.minInvestment)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h5 className="font-medium">Key Features</h5>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-medium">Requirements</h5>
                      <ul className="space-y-1">
                        {product.requirements.map((requirement, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <AlertTriangle className="h-3 w-3 text-warning" />
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Lock Period: {product.lockPeriod} days</span>
                      <span>Max: {formatCurrency(product.maxInvestment)}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4 mr-1" />
                        Learn More
                      </Button>
                      {product.status === "available" ? (
                        <Button
                          size="sm"
                          className="bg-bitcoin text-primary-foreground"
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Invest Now
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Clock className="h-4 w-4 mr-1" />
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Institutional Clients */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Institutional Clients</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border/40">
                  <th className="text-left py-2">Institution</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">AUM</th>
                  <th className="text-right py-2">Invested</th>
                  <th className="text-right py-2">Current Yield</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {institutionalClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-border/20 last:border-b-0"
                  >
                    <td className="py-3">
                      <div className="font-medium">{client.name}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        {getClientTypeIcon(client.type)}
                        <span className="capitalize">
                          {client.type.replace("-", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3">
                      {formatCurrency(client.aum)}
                    </td>
                    <td className="text-right py-3">
                      {formatCurrency(client.totalInvested)}
                    </td>
                    <td className="text-right py-3">
                      <span className="text-bitcoin font-medium">
                        {client.currentYield}%
                      </span>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={
                          client.status === "active"
                            ? "text-success border-success"
                            : client.status === "pending"
                            ? "text-warning border-warning"
                            : "text-destructive border-destructive"
                        }
                      >
                        {client.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {client.joinDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Institutional Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-bitcoin" />
              <h4 className="font-semibold">Enterprise Security</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Multi-signature wallets</li>
              <li>• Hardware security modules</li>
              <li>• Insurance coverage</li>
              <li>• Regular security audits</li>
              <li>• Compliance monitoring</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-bitcoin" />
              <h4 className="font-semibold">Advanced Analytics</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Real-time reporting</li>
              <li>• Custom dashboards</li>
              <li>• Risk analytics</li>
              <li>• Performance attribution</li>
              <li>• Regulatory reporting</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-bitcoin" />
              <h4 className="font-semibold">Dedicated Support</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 24/7 account management</li>
              <li>• Priority support</li>
              <li>• Custom integrations</li>
              <li>• Training and education</li>
              <li>• Strategic consulting</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
