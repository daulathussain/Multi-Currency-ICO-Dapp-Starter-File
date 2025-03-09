/**
 * Handles blockchain transaction errors and returns a user-friendly error message
 * @param {Error} error - The error object from the caught exception
 * @param {string} context - The context where the error occurred (e.g., "buying with ETH")
 * @param {boolean} logToConsole - Whether to log the error to console, defaults to true
 * @returns {Object} Object containing error message and error code
 */
export const handleTransactionError = (
  error,
  context = "transaction",
  logToConsole = true
) => {
  // Log to console if requested
  if (logToConsole) {
    console.error(`Error ${context}:`, error);
  }

  // Default error message and code
  let errorMessage = "Transaction failed";
  let errorCode = "UNKNOWN_ERROR";

  // Extract error code directly from the error object
  const code =
    error.code ||
    (error.error && error.error.code) ||
    (error.data && error.data.code);

  // Check for user rejection pattern in error message
  const isRejected =
    error.message &&
    (error.message.includes("user rejected") ||
      error.message.includes("rejected transaction") ||
      error.message.includes("User denied") ||
      error.message.includes("ACTION_REJECTED"));

  // Handle specific error types
  if (isRejected || code === "ACTION_REJECTED" || code === 4001) {
    errorMessage = "Transaction rejected by user";
    errorCode = "ACTION_REJECTED";
  } else if (code === "INSUFFICIENT_FUNDS" || code === -32000) {
    errorMessage = "Insufficient funds for transaction";
    errorCode = "INSUFFICIENT_FUNDS";
  } else if (error.reason) {
    errorMessage = error.reason;
    errorCode = "CONTRACT_ERROR";
  } else if (error.message) {
    // Clean up common RPC error messages
    const message = error.message;
    if (message.includes("gas required exceeds allowance")) {
      errorMessage = "Gas required exceeds your ETH balance";
      errorCode = "INSUFFICIENT_FUNDS";
    } else if (message.includes("nonce too low")) {
      errorMessage = "Transaction with same nonce already processed";
      errorCode = "NONCE_ERROR";
    } else if (message.includes("replacement transaction underpriced")) {
      errorMessage = "Gas price too low to replace pending transaction";
      errorCode = "GAS_PRICE_ERROR";
    } else {
      errorMessage = message;
    }
  }

  return { message: errorMessage, code: errorCode };
};

// ERC20 ABI for totalSupply and decimals functions
export const erc20Abi = [
  // Read-only functions
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",

  // Write functions
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)",
];

// Generate a unique ID for each notification
export const generateId = () =>
  `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
