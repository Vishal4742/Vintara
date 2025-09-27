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
                The Future of{" "}
                <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                  Bitcoin DeFi
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the next generation of decentralized finance with Bitcoin-native yield farming, 
                advanced liquidity provision, and AI-powered DeFi strategies.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="bitcoin">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <span>Launch App</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">$2.4B</div>
                <div className="text-sm text-muted-foreground">Total Value Locked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">45%</div>
                <div className="text-sm text-muted-foreground">Avg APY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">12K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Engineered for{" "}
              <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                Performance
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Built with cutting-edge technology to deliver the best DeFi experience on Bitcoin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 card-gradient border-border/40 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-bitcoin/10 flex items-center justify-center text-bitcoin mx-auto">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Maximum Yield</h3>
              <p className="text-sm text-muted-foreground">
                Optimized strategies to maximize your returns through advanced yield farming protocols.
              </p>
            </Card>

            <Card className="p-6 card-gradient border-border/40 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-bitcoin/10 flex items-center justify-center text-bitcoin mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Security First</h3>
              <p className="text-sm text-muted-foreground">
                Audited smart contracts and battle-tested protocols ensure your funds stay safe.
              </p>
            </Card>

            <Card className="p-6 card-gradient border-border/40 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-bitcoin/10 flex items-center justify-center text-bitcoin mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Lightning Network integration for instant, low-cost transactions.
              </p>
            </Card>

            <Card className="p-6 card-gradient border-border/40 text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-bitcoin/10 flex items-center justify-center text-bitcoin mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Governed by the community with transparent decision-making processes.
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
                Revolutionary AI agents that automatically optimize your DeFi strategies, 
                manage risk, and maximize returns while you sleep.
              </p>
            </div>
            
            <Card className="p-8 glass-card border-bitcoin/20 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="text-left space-y-2">
                  <div className="text-sm text-muted-foreground">AI Agent Status</div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm">Development in progress...</span>
                  </div>
                </div>
                <div className="text-left space-y-2">
                  <div className="text-sm text-muted-foreground">Expected Features</div>
                  <ul className="text-sm space-y-1">
                    <li>• Automated yield optimization</li>
                    <li>• Risk management strategies</li>
                    <li>• Market analysis & predictions</li>
                    <li>• Portfolio rebalancing</li>
                  </ul>
                </div>
              </div>
            </Card>
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
                Join thousands of users already earning with Vintara's Bitcoin-powered DeFi protocols.
              </p>
            </div>
            
            <Button asChild size="lg" variant="bitcoin">
              <Link to="/dashboard" className="flex items-center space-x-2">
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