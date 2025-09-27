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

      {/* App Preview Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center rounded-full border border-bitcoin/20 bg-bitcoin/10 px-4 py-2 text-sm text-bitcoin font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Experience the Interface
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Intuitive Design,{" "}
              <span className="bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for both beginners and professionals, Vintara's clean interface makes Bitcoin DeFi accessible to everyone.
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Animated Dashboard Mockup */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-card/50 to-card-elevated border border-bitcoin/20 p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-bitcoin/5 via-transparent to-bitcoin-light/5" />
              
              {/* Animated Background Grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 grid-rows-8 h-full gap-4">
                  {[...Array(96)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-bitcoin/20 rounded animate-pulse"
                      style={{
                        animationDelay: `${(i * 100) % 3000}ms`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="relative z-10 space-y-6">
                {/* Header Bar */}
                <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur rounded-xl border border-border/50">
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-bitcoin to-bitcoin-light flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">V</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-24 bg-foreground/20 rounded animate-pulse" />
                      <div className="h-1 w-16 bg-foreground/10 rounded animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-20 bg-bitcoin/20 rounded-lg animate-pulse" />
                    <div className="h-8 w-8 bg-foreground/10 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Portfolio', value: '$4.8K', trend: '+8.5%', color: 'from-green-500/20 to-green-600/20' },
                    { label: 'Liquidity', value: '$2.3K', trend: '+3.2%', color: 'from-blue-500/20 to-blue-600/20' },
                    { label: 'Yield', value: '$326', trend: '+18.9%', color: 'from-bitcoin/20 to-bitcoin-light/20' },
                    { label: 'APY', value: '12.4%', trend: 'neutral', color: 'from-purple-500/20 to-purple-600/20' }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-4 bg-background/60 backdrop-blur rounded-xl border border-border/30 space-y-3 animate-fade-in"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className="h-2 w-16 bg-foreground/20 rounded animate-pulse" />
                      <div className="space-y-1">
                        <div className="text-xl font-bold text-foreground">{stat.value}</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs bg-gradient-to-r ${stat.color}`}>
                          {stat.trend !== 'neutral' && stat.trend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Section */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Animated Chart */}
                  <div className="col-span-2 p-6 bg-background/60 backdrop-blur rounded-xl border border-border/30">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-foreground">Portfolio Performance</div>
                          <div className="text-xs text-muted-foreground">Last 30 days</div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="px-3 py-1 bg-bitcoin/20 rounded text-xs text-bitcoin font-medium">7D</div>
                          <div className="px-3 py-1 bg-foreground/10 rounded text-xs text-muted-foreground">30D</div>
                        </div>
                      </div>
                      
                      {/* Animated Line Chart */}
                      <div className="h-40 relative">
                        <svg className="w-full h-full" viewBox="0 0 400 160">
                          <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0.2" />
                            </linearGradient>
                            <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0.05" />
                            </linearGradient>
                          </defs>
                          
                          {/* Chart area fill */}
                          <path
                            d="M0,120 Q50,80 100,90 T200,70 T300,50 T400,40 L400,160 L0,160 Z"
                            fill="url(#chartFill)"
                            className="animate-fade-in"
                            style={{ animationDelay: '0.5s' }}
                          />
                          
                          {/* Chart line */}
                          <path
                            d="M0,120 Q50,80 100,90 T200,70 T300,50 T400,40"
                            stroke="url(#chartGradient)"
                            strokeWidth="3"
                            fill="none"
                            className="animate-draw-path"
                          />
                          
                          {/* Animated dots */}
                          {[0, 100, 200, 300, 400].map((x, i) => (
                            <circle
                              key={i}
                              cx={x}
                              cy={120 - i * 20}
                              r="4"
                              fill="rgb(251, 146, 60)"
                              className="animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                          
                          {/* Grid lines */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <line
                              key={i}
                              x1="0"
                              y1={40 + i * 30}
                              x2="400"
                              y2={40 + i * 30}
                              stroke="rgb(148, 163, 184)"
                              strokeOpacity="0.1"
                              strokeWidth="1"
                            />
                          ))}
                        </svg>
                        
                        {/* Chart value tooltip */}
                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur rounded-lg p-3 border border-border/30 animate-fade-in" style={{ animationDelay: '1s' }}>
                          <div className="text-xs text-muted-foreground">Current Value</div>
                          <div className="text-lg font-bold text-bitcoin">$4,847.32</div>
                          <div className="text-xs text-green-400">+18.9% ↗</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Activity Feed */}
                  <div className="p-6 bg-background/60 backdrop-blur rounded-xl border border-border/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-foreground">Recent Activity</div>
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { type: 'yield', amount: '+0.0054 BTC', desc: 'Yield earned', time: '2m ago', color: 'text-green-400' },
                        { type: 'lend', amount: '1.2 BTC', desc: 'Supplied to pool', time: '1h ago', color: 'text-blue-400' },
                        { type: 'swap', amount: '0.5 BTC', desc: 'Swapped for rBTC', time: '3h ago', color: 'text-bitcoin' },
                        { type: 'stake', amount: '2.1 BTC', desc: 'Staked for rewards', time: '1d ago', color: 'text-purple-400' }
                      ].map((activity, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-3 animate-slide-in p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        >
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            activity.type === 'yield' ? 'bg-green-500/20' :
                            activity.type === 'lend' ? 'bg-blue-500/20' :
                            activity.type === 'swap' ? 'bg-bitcoin/20' : 'bg-purple-500/20'
                          }`}>
                            <div className={`text-xs font-bold ${activity.color}`}>
                              {activity.type === 'yield' ? '↗' : 
                               activity.type === 'lend' ? '⊕' : 
                               activity.type === 'swap' ? '↔' : '⬢'}
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-xs font-medium text-foreground">{activity.amount}</div>
                            <div className="text-xs text-muted-foreground">{activity.desc}</div>
                            <div className="text-xs text-muted-foreground/70">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Dashboard Features Row */}
                <div className="grid grid-cols-4 gap-4">
                  {/* Quick Actions */}
                  <div className="col-span-2 p-4 bg-background/60 backdrop-blur rounded-xl border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-foreground">Quick Actions</div>
                      <div className="text-xs text-muted-foreground">One-click</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Lend BTC Button */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-blue-400/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="text-center space-y-2">
                          <div className="text-2xl">🏦</div>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-blue-400">Lend BTC</div>
                            <div className="text-xs text-blue-300">Earn 8.5% APY</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Add Liquidity Button */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/30 to-green-600/30 border border-green-400/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="text-center space-y-2">
                          <div className="text-2xl">💧</div>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-green-400">Add Liquidity</div>
                            <div className="text-xs text-green-300">Pool rewards</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Swap Tokens Button */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-bitcoin/30 to-bitcoin-light/30 border border-bitcoin/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="text-center space-y-2">
                          <div className="text-2xl">🔄</div>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-bitcoin">Swap Tokens</div>
                            <div className="text-xs text-bitcoin-light">Best rates</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stake & Earn Button */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                        <div className="text-center space-y-2">
                          <div className="text-2xl">⭐</div>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-purple-400">Stake & Earn</div>
                            <div className="text-xs text-purple-300">Up to 15% APY</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Stats */}
                  <div className="col-span-2 p-4 bg-background/60 backdrop-blur rounded-xl border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-foreground">Market Pulse</div>
                      <div className="flex items-center space-x-1">
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                        <div className="text-xs text-green-400">Live</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'BTC Price', value: '$43,250', change: '+2.4%' },
                        { label: 'TVL', value: '$2.1M', change: '+12.8%' },
                        { label: 'Avg APY', value: '8.7%', change: '+0.3%' }
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between animate-slide-in"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs font-medium text-foreground">{stat.value}</div>
                            <div className="text-xs text-green-400">{stat.change}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-bitcoin/40 rounded-full animate-float"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced Secure Section */}
            <div className="absolute -top-6 -left-6 z-20">
              <Card className="p-4 card-elevated border-bitcoin/20 bg-background/95 backdrop-blur">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500/20 to-green-600/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">Secure</div>
                      <div className="text-xs text-muted-foreground">Multi-sig protected</div>
                    </div>
                  </div>
                  <div className="space-y-1 pl-11">
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="text-xs text-muted-foreground">256-bit encryption</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="text-xs text-muted-foreground">Hardware wallet support</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="text-xs text-muted-foreground">Non-custodial</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute -bottom-6 -right-6 z-20">
              <Card className="p-4 card-elevated border-bitcoin/20 bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-bitcoin/20 to-bitcoin-light/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-bitcoin" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Real-time</div>
                    <div className="text-xs text-muted-foreground">Live updates</div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 z-20">
              <Card className="p-4 card-elevated border-bitcoin/20 bg-background/95 backdrop-blur">
                <div className="text-center space-y-1">
                  <div className="text-lg font-bold text-bitcoin">1-Click</div>
                  <div className="text-xs text-muted-foreground">Easy Trading</div>
                </div>
              </Card>
            </div>
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/vintara-dashboard-preview.png"
                  alt="Vintara Dashboard Preview"
                  className="w-full h-auto rounded-2xl border border-bitcoin/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating metrics overlay */}
              <div className="absolute -bottom-6 -right-6 z-10">
                <Card className="p-4 card-elevated border-bitcoin/20 bg-background/95 backdrop-blur">
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-bitcoin">Live</div>
                      <div className="text-xs text-muted-foreground">Dashboard</div>
                    </div>
                  </div>
                </Card>
              </div>
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
