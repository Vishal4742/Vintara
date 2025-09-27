import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Zap, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bitcoin/5 to-transparent" />
        <div className="container relative py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Vintara -{" "}
                <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                  Native Bitcoin DeFi
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Seamless Bitcoin Yield. Powered by Rootstock.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="bitcoin">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <span>Launch App</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  featuresSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">
                  $47.2M
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Value Locked
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">
                  42.3%
                </div>
                <div className="text-sm text-muted-foreground">Avg APY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">
                  1.2K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">
                  Bitcoin Security
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Built on{" "}
              <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                Rootstock
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Leveraging Bitcoin's unmatched security and stability through
              Rootstock's EVM-compatible sidechain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => (window.location.href = "/yield")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Yield Farming</h3>
              <p className="text-sm text-muted-foreground">
                Stake tokens and LP positions to earn high yields with automated
                strategies.
              </p>
            </Card>

            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => (window.location.href = "/lending")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Lending Protocol</h3>
              <p className="text-sm text-muted-foreground">
                Borrow against Bitcoin collateral or supply liquidity to earn
                interest.
              </p>
            </Card>

            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => (window.location.href = "/swap")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">DEX Aggregator</h3>
              <p className="text-sm text-muted-foreground">
                Trade tokens with optimal prices across multiple liquidity
                sources.
              </p>
            </Card>

            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => (window.location.href = "/liquidity")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Liquidity Pools</h3>
              <p className="text-sm text-muted-foreground">
                Provide liquidity to earn trading fees and additional rewards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-card/50 to-card-elevated/50">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-bitcoin/20 bg-bitcoin/10 px-3 py-1 text-sm text-bitcoin">
                Coming Soon
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold">
                AI-Powered{" "}
                <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                  DeFi Agents
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Revolutionary AI agents that automatically optimize your DeFi
                strategies, manage risk, and maximize returns while you sleep.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-6 card-gradient border-border/40 hover:border-bitcoin/20 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Intelligent Yield Optimization
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered portfolio management
                      </p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Automated yield optimization</li>
                    <li>• Risk management strategies</li>
                    <li>• Market analysis & predictions</li>
                    <li>• Portfolio rebalancing</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6 card-gradient border-border/40 hover:border-bitcoin/20 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Automated DeFi Agents</h3>
                      <p className="text-sm text-muted-foreground">
                        Smart contract automation
                      </p>
                    </div>
                  </div>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Liquidation bots</li>
                    <li>• Arbitrage opportunities</li>
                    <li>• Governance participation</li>
                    <li>• Yield harvesting</li>
                  </ul>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center rounded-full border border-bitcoin/20 bg-bitcoin/10 px-4 py-2 text-sm text-bitcoin">
                <div className="h-2 w-2 rounded-full bg-bitcoin animate-pulse mr-2" />
                Development in progress - Coming Q2 2024
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="container">
          <Card className="p-8 lg:p-12 card-elevated border-bitcoin/20 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Start Your{" "}
                <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                  DeFi Journey?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join the Bitcoin DeFi revolution with Vintara and start earning
                native Bitcoin yield on Rootstock today.
              </p>
            </div>

            <Button asChild size="lg" variant="bitcoin">
              <Link to="/yield" className="flex items-center space-x-2">
                <span>Launch App</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
