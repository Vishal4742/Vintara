import { createContext, useContext, ReactNode } from "react";
import {
  TransactionNotification,
  useTransactionNotifications,
} from "@/components/ui/TransactionNotification";

interface TransactionContextType {
  addTransaction: (transaction: {
    type: "swap" | "deposit" | "withdraw" | "yield" | "liquidity";
    status: "pending" | "success" | "failed";
    amount: string;
    token: string;
    hash?: string;
  }) => void;
  updateTransactionStatus: (
    id: string,
    status: "pending" | "success" | "failed",
    hash?: string
  ) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const {
    transactions,
    addTransaction,
    removeTransaction,
    updateTransactionStatus,
  } = useTransactionNotifications();

  return (
    <TransactionContext.Provider
      value={{ addTransaction, updateTransactionStatus }}
    >
      {children}
      {/* Render all transaction notifications */}
      {transactions.map((transaction) => (
        <TransactionNotification
          key={transaction.id}
          transaction={transaction}
          onClose={() => removeTransaction(transaction.id)}
        />
      ))}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
}
