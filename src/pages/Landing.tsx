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
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-bitcoin/20 bg-bitcoin/10 px-4 py-2 text-sm text-bitcoin font-medium">
                <Shield className="h-4 w-4 mr-2" />
                Secured by Bitcoin. Powered by Rootstock.
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                  Earn Seamless Bitcoin Yield
                </span>{" "}
                with Native DeFi Technology
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Unlock the full potential of your Bitcoin with secure and effortless yield generation, powered by Rootstock's battle-tested infrastructure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="bitcoin">
                <Link to="/yield" className="flex items-center space-x-2">
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
                  $2.1M
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Value Locked
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">
                  12.4%
                </div>
                <div className="text-sm text-muted-foreground">Avg APY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-bitcoin">
                  150+
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

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 pt-12 border-t border-border/20">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-bitcoin" />
                <span>Audited Smart Contracts</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="h-4 w-4 text-bitcoin">🔒</span>
                <span>Multi-Signature Security</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="h-4 w-4 text-bitcoin">⚡</span>
                <span>Rootstock Network</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="h-4 w-4 text-bitcoin">✅</span>
                <span>Decentralized & Trustless</span>
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
              Why Choose{" "}
              <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                Vintara?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              The most secure and profitable way to put your Bitcoin to work, backed by Rootstock's proven infrastructure and institutional-grade security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => (window.location.href = "/yield")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Maximize Bitcoin Yield</h3>
              <p className="text-sm text-muted-foreground">
                Earn up to 15% APY on your Bitcoin through automated yield strategies that work 24/7, optimized for consistent returns.
              </p>
            </Card>

            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => (window.location.href = "/lending")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Bitcoin-Secured Lending</h3>
              <p className="text-sm text-muted-foreground">
                Unlock liquidity without selling your Bitcoin. Borrow against your holdings or earn interest by supplying to the most secure lending protocol.
              </p>
            </Card>

            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => (window.location.href = "/swap")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Lightning-Fast Swaps</h3>
              <p className="text-sm text-muted-foreground">
                Trade any token instantly with the best prices across all DEXs. Save on fees and maximize your trading efficiency.
              </p>
            </Card>

            <Card
              className="p-6 card-gradient border-border/40 text-center space-y-4 hover:border-bitcoin/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              onClick={() => (window.location.href = "/liquidity")}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center text-bitcoin mx-auto group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">Passive Income Pools</h3>
              <p className="text-sm text-muted-foreground">
                Earn trading fees and bonus rewards by providing liquidity. Set it and forget it while your assets generate passive income.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-background via-card/20 to-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-bitcoin/20 bg-bitcoin/10 px-3 py-1 text-sm text-bitcoin font-medium">
                  <span className="h-2 w-2 rounded-full bg-bitcoin mr-2"></span>
                  Bitcoin's First Native DeFi
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                  The Future of{" "}
                  <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                    Bitcoin Finance
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  While other chains promise high yields, only Vintara delivers Bitcoin-native DeFi with the security and stability you trust.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-bitcoin" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Unmatched Security</h3>
                    <p className="text-muted-foreground text-sm">
                      Backed by Bitcoin's $500B+ security model. No bridge risks, no centralized validators.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-bitcoin" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real Bitcoin Yield</h3>
                    <p className="text-muted-foreground text-sm">
                      Generate actual Bitcoin returns, not wrapped tokens or IOUs. Your Bitcoin stays Bitcoin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-bitcoin" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Institutional Grade</h3>
                    <p className="text-muted-foreground text-sm">
                      Built for both retail and institutions with advanced risk management and compliance features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="bitcoin" className="flex-1">
                  <Link to="/dashboard" className="flex items-center justify-center space-x-2">
                    <span>Start Earning</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Link to="/analytics" className="flex items-center justify-center space-x-2">
                    <span>View Analytics</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 card-elevated border-bitcoin/20">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">Portfolio Performance</h3>
                    <p className="text-muted-foreground">Average user gains in 30 days</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-bitcoin/5 to-bitcoin-light/5 border border-bitcoin/10">
                      <div className="text-2xl font-bold text-bitcoin">+18.5%</div>
                      <div className="text-sm text-muted-foreground">Yield Farming APY</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-bitcoin/5 to-bitcoin-light/5 border border-bitcoin/10">
                      <div className="text-2xl font-bold text-bitcoin">+8.7%</div>
                      <div className="text-sm text-muted-foreground">LP Rewards</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-bitcoin/5 to-bitcoin-light/5 border border-bitcoin/10">
                      <div className="text-2xl font-bold text-bitcoin">0.5%</div>
                      <div className="text-sm text-muted-foreground">Platform Fee</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-bitcoin/5 to-bitcoin-light/5 border border-bitcoin/10">
                      <div className="text-2xl font-bold text-bitcoin">99.2%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-card/30 to-transparent">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold mb-4">Trusted by Bitcoin Holders Worldwide</h3>
            <p className="text-muted-foreground">Join thousands who are already maximizing their Bitcoin potential</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 card-gradient border-border/40 text-center space-y-4">
              <div className="flex justify-center space-x-1 text-bitcoin">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>
              <blockquote className="text-sm text-muted-foreground italic">
                "Finally, a way to earn yield on Bitcoin without the bridge risks. The security is unmatched."
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold">Sarah K.</div>
                <div className="text-muted-foreground">Bitcoin Maximalist</div>
              </div>
            </Card>

            <Card className="p-6 card-gradient border-border/40 text-center space-y-4">
              <div className="flex justify-center space-x-1 text-bitcoin">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>
              <blockquote className="text-sm text-muted-foreground italic">
                "The yields are incredible and I love that my Bitcoin stays as Bitcoin. No wrapped tokens nonsense."
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold">Michael R.</div>
                <div className="text-muted-foreground">DeFi Investor</div>
              </div>
            </Card>

            <Card className="p-6 card-gradient border-border/40 text-center space-y-4">
              <div className="flex justify-center space-x-1 text-bitcoin">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>
              <blockquote className="text-sm text-muted-foreground italic">
                "Professional grade platform with institutional security. Perfect for our treasury management."
              </blockquote>
              <div className="text-sm">
                <div className="font-semibold">Lisa T.</div>
                <div className="text-muted-foreground">Fund Manager</div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span>99.2% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span>$0 Lost to Hacks</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span>24/7 Support</span>
              </div>
            </div>
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
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-bitcoin/5 via-bitcoin-light/5 to-bitcoin/5 rounded-3xl"></div>
            <Card className="relative p-8 lg:p-16 card-elevated border-bitcoin/20 text-center space-y-8 rounded-3xl">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-bitcoin/20 bg-bitcoin/10 px-4 py-2 text-sm text-bitcoin font-medium">
                  <span className="h-2 w-2 rounded-full bg-bitcoin animate-pulse mr-2"></span>
                  Join 150+ Bitcoin Holders
                </div>
                <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
                  Ready to{" "}
                  <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                    Grow Your Bitcoin?
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Join thousands of smart Bitcoin holders who are already earning passive yield with Vintara. Start your DeFi journey in under 2 minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button asChild size="lg" variant="bitcoin" className="flex-1 h-14 text-lg">
                  <Link to="/yield" className="flex items-center justify-center space-x-2">
                    <span>Launch App</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="flex-1 h-14 text-lg">
                  <Link to="/analytics" className="flex items-center justify-center space-x-2">
                    <span>View Stats</span>
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-border/20">
                <p className="text-sm text-muted-foreground">
                  No KYC required • Connect any wallet • Start with any amount
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
