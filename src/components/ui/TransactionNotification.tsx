import { useState, useEffect } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { X, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  type: "swap" | "deposit" | "withdraw" | "yield" | "liquidity";
  status: "pending" | "success" | "failed";
  amount: string;
  token: string;
  hash?: string;
  timestamp: number;
}

interface TransactionNotificationProps {
  transaction: Transaction;
  onClose: () => void;
}

export function TransactionNotification({
  transaction,
  onClose,
}: TransactionNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "pending":
        return <Clock className="h-5 w-5 text-warning animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "success":
        return "bg-success/10 border-success/20 text-success";
      case "failed":
        return "bg-destructive/10 border-destructive/20 text-destructive";
      case "pending":
        return "bg-warning/10 border-warning/20 text-warning";
      default:
        return "bg-muted/10 border-muted/20 text-muted-foreground";
    }
  };

  const getTypeLabel = () => {
    switch (transaction.type) {
      case "swap":
        return "Token Swap";
      case "deposit":
        return "Deposit";
      case "withdraw":
        return "Withdrawal";
      case "yield":
        return "Yield Claim";
      case "liquidity":
        return "Liquidity";
      default:
        return "Transaction";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className={`p-4 w-80 ${getStatusColor()}`}>
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{getTypeLabel()}</span>
                <Badge variant="outline" className="text-xs">
                  {transaction.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {transaction.amount} {transaction.token}
              </p>
              {transaction.hash && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-muted-foreground">
                    {transaction.hash.slice(0, 8)}...
                    {transaction.hash.slice(-6)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => {
                      const explorerUrl = `https://explorer.testnet.rsk.co/tx/${transaction.hash}`;
                      window.open(explorerUrl, "_blank");
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Hook for managing transaction notifications
export function useTransactionNotifications() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const updateTransactionStatus = (
    id: string,
    status: Transaction["status"],
    hash?: string
  ) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, status, hash } : tx))
    );
  };

  return {
    transactions,
    addTransaction,
    removeTransaction,
    updateTransactionStatus,
  };
}
