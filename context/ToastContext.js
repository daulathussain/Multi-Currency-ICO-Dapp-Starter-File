import React, { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

// Create context
const ToastContext = createContext(undefined);

// Brand color and derived colors
const BRAND_COLOR = "#13101A";
const TOAST_STYLES = {
  common: {
    background: BRAND_COLOR,
    color: "white",
    padding: "16px",
    borderRadius: "6px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  processing: {
    borderLeft: "4px solid #facc15", // Yellow
  },
  approve: {
    borderLeft: "4px solid #22c55e", // Green
  },
  complete: {
    borderLeft: "4px solid #22c55e", // Green
  },
  reject: {
    borderLeft: "4px solid #ef4444", // Red
  },
  failed: {
    borderLeft: "4px solid #f97316", // Orange
  },
  info: {
    borderLeft: "4px solid #E7479B", // Blue
  },
};

/**
 * Toast notification provider using react-hot-toast with brand colors
 * Provides simple functions for showing different transaction states
 */
export const ToastProvider = ({ children }) => {
  /**
   * Show a processing notification
   * @param {string} message - Message to display
   * @returns {string} - Toast ID that can be used to update the toast
   */
  const showProcessing = (message) => {
    return toast.loading(message, {
      style: {
        ...TOAST_STYLES.common,
        ...TOAST_STYLES.processing,
      },
    });
  };

  /**
   * Show an approval notification
   * @param {string} message - Message to display
   * @returns {string} - Toast ID
   */
  const showApprove = (message) => {
    return toast.success(message, {
      style: {
        ...TOAST_STYLES.common,
        ...TOAST_STYLES.approve,
      },
      duration: 5000,
    });
  };

  /**
   * Show a completion notification
   * @param {string} message - Message to display
   * @returns {string} - Toast ID
   */
  const showComplete = (message) => {
    return toast.success(message, {
      style: {
        ...TOAST_STYLES.common,
        ...TOAST_STYLES.complete,
      },
      icon: "🎉",
      duration: 5000,
    });
  };

  /**
   * Show a rejection notification
   * @param {string} message - Message to display
   * @returns {string} - Toast ID
   */
  const showReject = (message) => {
    return toast.error(message, {
      style: {
        ...TOAST_STYLES.common,
        ...TOAST_STYLES.reject,
      },
      duration: 5000,
    });
  };

  /**
   * Show a failure notification
   * @param {string} message - Message to display
   * @returns {string} - Toast ID
   */
  const showFailed = (message) => {
    return toast.error(message, {
      style: {
        ...TOAST_STYLES.common,
        ...TOAST_STYLES.failed,
      },
      icon: "⚠️",
      duration: 6000,
    });
  };

  /**
   * Show an info notification
   * @param {string} message - Message to display
   * @returns {string} - Toast ID
   */
  const showInfo = (message) => {
    return toast(message, {
      style: {
        ...TOAST_STYLES.common,
        ...TOAST_STYLES.info,
      },
      duration: 4000,
    });
  };

  /**
   * Update an existing toast
   * @param {string} id - Toast ID to update
   * @param {string} state - New state ('processing', 'approve', 'complete', 'reject', 'failed', 'info')
   * @param {string} message - New message to display
   */
  const updateToast = (id, state, message) => {
    if (!id) return;

    // Dismiss the existing toast
    toast.dismiss(id);

    // Create a new toast based on the state
    switch (state) {
      case "processing":
        return showProcessing(message);
      case "approve":
        return showApprove(message);
      case "complete":
        return showComplete(message);
      case "reject":
        return showReject(message);
      case "failed":
        return showFailed(message);
      case "info":
      default:
        return showInfo(message);
    }
  };

  // Simpler API for transaction flow
  const notify = {
    // Start a transaction flow and track its progress
    start: (message = "Processing transaction...") => {
      return showProcessing(message);
    },
    // Update the state of an ongoing transaction
    update: (id, state, message) => {
      return updateToast(id, state, message);
    },
    // Shorthand methods for common updates
    approve: (id, message = "Transaction approved!") => {
      return updateToast(id, "approve", message);
    },
    complete: (id, message = "Transaction completed successfully!") => {
      return updateToast(id, "complete", message);
    },
    reject: (id, message = "Transaction rejected") => {
      return updateToast(id, "reject", message);
    },
    fail: (id, message = "Transaction failed") => {
      return updateToast(id, "failed", message);
    },
  };

  return (
    <ToastContext.Provider
      value={{
        showProcessing,
        showApprove,
        showComplete,
        showReject,
        showFailed,
        showInfo,
        updateToast,
        notify,
        toast, // Also expose the original toast for advanced usage
      }}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          // Custom icon rendering to ensure visibility on dark background
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use the Toast context
export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
