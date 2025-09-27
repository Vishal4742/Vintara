import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Vote,
  FileText,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  BarChart3,
  Target,
  Shield,
  Zap,
  DollarSign,
  Activity,
  Info,
} from "lucide-react";

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "passed" | "failed" | "executed" | "pending";
  startTime: number;
  endTime: number;
  forVotes: number;
  againstVotes: number;
  quorum: number;
  category: "protocol" | "treasury" | "parameter" | "emergency";
  executionTime?: number;
  votes: {
    voter: string;
    support: boolean;
    votes: number;
  }[];
}

interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  totalVoters: number;
  totalVotingPower: number;
  quorumThreshold: number;
  votingPeriod: number;
  executionDelay: number;
}

export default function Governance() {
  const [activeTab, setActiveTab] = useState("proposals");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [userVotingPower, setUserVotingPower] = useState(1250);

  const governanceStats: GovernanceStats = {
    totalProposals: 24,
    activeProposals: 3,
    totalVoters: 892,
    totalVotingPower: 1250000,
    quorumThreshold: 250000,
    votingPeriod: 3,
    executionDelay: 1,
  };

  const proposals: Proposal[] = [
    {
      id: 1,
      title: "Increase Yield Vault APY to 25%",
      description:
        "Proposal to increase the base APY for the main yield vault from 20% to 25% to attract more liquidity and compete with other protocols.",
      proposer: "0x1234...5678",
      status: "active",
      startTime: Date.now() - 86400000, // 1 day ago
      endTime: Date.now() + 172800000, // 2 days from now
      forVotes: 180000,
      againstVotes: 45000,
      quorum: 250000,
      category: "parameter",
      votes: [
        { voter: "0x1111...2222", support: true, votes: 50000 },
        { voter: "0x3333...4444", support: false, votes: 25000 },
        { voter: "0x5555...6666", support: true, votes: 75000 },
      ],
    },
    {
      id: 2,
      title: "Add New Token Support: DAI",
      description:
        "Add DAI as a supported token for lending and yield farming to increase protocol diversity and attract more users.",
      proposer: "0x9876...5432",
      status: "active",
      startTime: Date.now() - 172800000, // 2 days ago
      endTime: Date.now() + 86400000, // 1 day from now
      forVotes: 220000,
      againstVotes: 30000,
      quorum: 250000,
      category: "protocol",
      votes: [
        { voter: "0x7777...8888", support: true, votes: 100000 },
        { voter: "0x9999...0000", support: true, votes: 80000 },
        { voter: "0x1111...3333", support: false, votes: 30000 },
      ],
    },
    {
      id: 3,
      title: "Emergency Pause Protocol",
      description:
        "Emergency proposal to pause the protocol due to potential security vulnerability discovered in the lending contract.",
      proposer: "0x4567...8901",
      status: "active",
      startTime: Date.now() - 43200000, // 12 hours ago
      endTime: Date.now() + 129600000, // 1.5 days from now
      forVotes: 150000,
      againstVotes: 20000,
      quorum: 250000,
      category: "emergency",
      votes: [
        { voter: "0x2222...4444", support: true, votes: 100000 },
        { voter: "0x6666...8888", support: true, votes: 50000 },
        { voter: "0x0000...1111", support: false, votes: 20000 },
      ],
    },
    {
      id: 4,
      title: "Treasury Fund Allocation",
      description:
        "Allocate 10% of treasury funds for marketing and community development initiatives.",
      proposer: "0x1357...2468",
      status: "passed",
      startTime: Date.now() - 259200000, // 3 days ago
      endTime: Date.now() - 86400000, // 1 day ago
      forVotes: 280000,
      againstVotes: 40000,
      quorum: 250000,
      category: "treasury",
      executionTime: Date.now() + 86400000, // 1 day from now
      votes: [
        { voter: "0x3333...5555", support: true, votes: 120000 },
        { voter: "0x7777...9999", support: true, votes: 100000 },
        { voter: "0x1111...2222", support: true, votes: 60000 },
        { voter: "0x4444...6666", support: false, votes: 40000 },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-warning border-warning";
      case "passed":
        return "text-success border-success";
      case "failed":
        return "text-destructive border-destructive";
      case "executed":
        return "text-bitcoin border-bitcoin";
      case "pending":
        return "text-muted-foreground border-muted";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "protocol":
        return <Zap className="h-4 w-4" />;
      case "treasury":
        return <DollarSign className="h-4 w-4" />;
      case "parameter":
        return <Target className="h-4 w-4" />;
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "Ended";
  };

  const getVotingProgress = (proposal: Proposal) => {
    const totalVotes = proposal.forVotes + proposal.againstVotes;
    const forPercentage = (proposal.forVotes / totalVotes) * 100;
    const againstPercentage = (proposal.againstVotes / totalVotes) * 100;
    const quorumProgress = (totalVotes / proposal.quorum) * 100;

    return { forPercentage, againstPercentage, quorumProgress, totalVotes };
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Governance</h1>
          <p className="text-muted-foreground">
            Participate in protocol governance and vote on proposals
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Your Voting Power
            </div>
            <div className="text-lg font-bold text-bitcoin">
              {userVotingPower.toLocaleString()} VINT
            </div>
          </div>
          <Dialog
            open={showCreateProposal}
            onOpenChange={setShowCreateProposal}
          >
            <DialogTrigger asChild>
              <Button className="bg-bitcoin text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Proposal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Proposal Title</label>
                  <Input placeholder="Enter proposal title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protocol">Protocol Change</SelectItem>
                      <SelectItem value="treasury">Treasury</SelectItem>
                      <SelectItem value="parameter">
                        Parameter Update
                      </SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your proposal in detail..."
                    rows={6}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateProposal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-bitcoin text-primary-foreground">
                    Create Proposal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Total Proposals
              </span>
            </div>
            <div className="text-2xl font-bold">
              {governanceStats.totalProposals}
            </div>
            <div className="text-xs text-success">+3 this week</div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Vote className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Active Proposals
              </span>
            </div>
            <div className="text-2xl font-bold">
              {governanceStats.activeProposals}
            </div>
            <div className="text-xs text-warning">Voting in progress</div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Total Voters
              </span>
            </div>
            <div className="text-2xl font-bold">
              {governanceStats.totalVoters.toLocaleString()}
            </div>
            <div className="text-xs text-success">+12% this month</div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Voting Power
              </span>
            </div>
            <div className="text-2xl font-bold">
              {(governanceStats.totalVotingPower / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">VINT tokens</div>
          </div>
        </Card>
      </div>

      {/* Governance Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="voting">Voting Power</TabsTrigger>
          <TabsTrigger value="treasury">Treasury</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-6">
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const {
                forPercentage,
                againstPercentage,
                quorumProgress,
                totalVotes,
              } = getVotingProgress(proposal);

              return (
                <Card
                  key={proposal.id}
                  className="p-6 card-gradient border-border/40"
                >
                  <div className="space-y-4">
                    {/* Proposal Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">
                            {proposal.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={getStatusColor(proposal.status)}
                          >
                            {proposal.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            {getCategoryIcon(proposal.category)}
                            <span>{proposal.category}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                          {proposal.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Proposed by: {proposal.proposer}</span>
                          <span>•</span>
                          <span>ID: #{proposal.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {proposal.status === "active" && (
                          <>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4 mr-1" />
                              Vote Against
                            </Button>
                            <Button
                              size="sm"
                              className="bg-bitcoin text-primary-foreground"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Vote For
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>

                    {/* Voting Progress */}
                    {proposal.status === "active" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-success">
                              {forPercentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              For
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {proposal.forVotes.toLocaleString()} votes
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-destructive">
                              {againstPercentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Against
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {proposal.againstVotes.toLocaleString()} votes
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-bitcoin">
                              {quorumProgress.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Quorum
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {totalVotes.toLocaleString()} /{" "}
                              {proposal.quorum.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Voting Progress</span>
                            <span>
                              {formatTime(proposal.endTime)} remaining
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-success">For</span>
                              <span className="text-destructive">Against</span>
                            </div>
                            <div className="flex h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-success"
                                style={{ width: `${forPercentage}%` }}
                              />
                              <div
                                className="bg-destructive"
                                style={{ width: `${againstPercentage}%` }}
                              />
                            </div>
                          </div>
                          <Progress value={quorumProgress} className="h-1" />
                        </div>
                      </div>
                    )}

                    {/* Proposal Status */}
                    {proposal.status !== "active" && (
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {proposal.status === "passed" &&
                                "✅ Proposal Passed"}
                              {proposal.status === "failed" &&
                                "❌ Proposal Failed"}
                              {proposal.status === "executed" &&
                                "🚀 Proposal Executed"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Final Results: {forPercentage.toFixed(1)}% For,{" "}
                              {againstPercentage.toFixed(1)}% Against
                            </div>
                          </div>
                          {proposal.executionTime && (
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">
                                Execution Time
                              </div>
                              <div className="font-medium">
                                {formatTime(proposal.executionTime)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="voting" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Voting Power Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Your VINT Balance
                    </div>
                    <div className="text-2xl font-bold text-bitcoin">
                      {userVotingPower.toLocaleString()} VINT
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Delegated To
                    </div>
                    <div className="text-lg font-medium">Not Delegated</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Voting Power
                    </div>
                    <div className="text-lg font-medium">
                      {userVotingPower.toLocaleString()} VINT
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Governance Parameters
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quorum Threshold:</span>
                        <span>
                          {governanceStats.quorumThreshold.toLocaleString()}{" "}
                          VINT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Voting Period:</span>
                        <span>{governanceStats.votingPeriod} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Execution Delay:</span>
                        <span>{governanceStats.executionDelay} day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Delegate Votes
                </Button>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Delegates
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="treasury" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Treasury Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bitcoin">$2.4M</div>
                  <div className="text-sm text-muted-foreground">
                    Total Treasury
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">$180K</div>
                  <div className="text-sm text-muted-foreground">
                    Available for Proposals
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">$45K</div>
                  <div className="text-sm text-muted-foreground">
                    Pending Allocations
                  </div>
                </div>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Treasury funds are managed through governance proposals. All
                  allocations require community approval.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Community Stats */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Community Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Voters</span>
                    <span className="font-medium">892</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Proposal Creators
                    </span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Delegates</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Community Score
                    </span>
                    <span className="font-medium text-bitcoin">8.7/10</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Delegates */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Top Delegates</h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "DeFiMax",
                      votes: 125000,
                      proposals: 8,
                      success: 75,
                    },
                    {
                      name: "BitcoinBuilder",
                      votes: 98000,
                      proposals: 12,
                      success: 83,
                    },
                    {
                      name: "YieldMaster",
                      votes: 87000,
                      proposals: 6,
                      success: 100,
                    },
                    {
                      name: "ProtocolGuard",
                      votes: 76000,
                      proposals: 15,
                      success: 67,
                    },
                  ].map((delegate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div>
                        <div className="font-medium">{delegate.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {delegate.proposals} proposals • {delegate.success}%
                          success
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {delegate.votes.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          votes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Community Forums */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Community Forums</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-bitcoin/20 flex items-center justify-center">
                      <span className="text-lg">💬</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Discord</h4>
                      <p className="text-sm text-muted-foreground">
                        2,847 members
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-bitcoin/20 flex items-center justify-center">
                      <span className="text-lg">🐦</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Twitter</h4>
                      <p className="text-sm text-muted-foreground">
                        15.2K followers
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-bitcoin/20 flex items-center justify-center">
                      <span className="text-lg">📝</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Forum</h4>
                      <p className="text-sm text-muted-foreground">
                        1,234 posts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Community Events */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Upcoming Community Events
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "Governance Town Hall",
                    date: "2024-01-15",
                    time: "2:00 PM UTC",
                    type: "meeting",
                    attendees: 156,
                  },
                  {
                    title: "Protocol Upgrade Discussion",
                    date: "2024-01-18",
                    time: "3:00 PM UTC",
                    type: "discussion",
                    attendees: 89,
                  },
                  {
                    title: "Community AMA",
                    date: "2024-01-22",
                    time: "1:00 PM UTC",
                    type: "ama",
                    attendees: 234,
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        {event.date} at {event.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-2">
                        {event.type}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {event.attendees} attending
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
