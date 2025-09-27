import { Link } from "react-router-dom";
import { Github, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-bitcoin to-bitcoin-light flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  V
                </span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-bitcoin to-bitcoin-light bg-clip-text text-transparent">
                Vintara
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Next-generation Bitcoin-powered DeFi protocol
            </p>
          </div>

          {/* Protocol */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Protocol</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/swap"
                  className="hover:text-bitcoin transition-colors"
                >
                  Swap
                </Link>
              </li>
              <li>
                <Link
                  to="/liquidity"
                  className="hover:text-bitcoin transition-colors"
                >
                  Liquidity
                </Link>
              </li>
              <li>
                <Link
                  to="/yield"
                  className="hover:text-bitcoin transition-colors"
                >
                  Yield Farming
                </Link>
              </li>
              <li>
                <span className="text-accent">AI Agents (Soon)</span>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-bitcoin transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-bitcoin transition-colors">
                  Governance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-bitcoin transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-bitcoin transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://x.com/vintarastock"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-bitcoin transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-bitcoin transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/aniketsahu115/vintara"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-bitcoin transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Vintara. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-bitcoin transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-bitcoin transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
