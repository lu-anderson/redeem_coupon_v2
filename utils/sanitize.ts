/**
 * Utility functions for input sanitization and validation
 * Prevents XSS attacks and ensures data integrity
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param unsafe - The potentially unsafe string to sanitize
 * @returns Sanitized string safe for rendering
 */
export function escapeHtml(unsafe: string | undefined | null): string {
  if (!unsafe) return '';
  
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates and sanitizes a coupon ID
 * Coupon IDs should be alphanumeric with possible hyphens/underscores
 * @param id - The ID to validate
 * @returns Sanitized ID or null if invalid
 */
export function sanitizeCouponId(id: string | undefined): string | null {
  if (!id) return null;
  
  // Remove any whitespace
  const trimmed = id.trim();
  
  // Validate format: alphanumeric, hyphens, underscores only
  // Maximum length of 128 characters (Firestore document ID limit)
  const validPattern = /^[a-zA-Z0-9_-]{1,128}$/;
  
  if (!validPattern.test(trimmed)) {
    return null;
  }
  
  return trimmed;
}

/**
 * Validates and sanitizes a user name input
 * @param name - The name to validate
 * @returns Object with validation result and sanitized value
 */
export function validateUserName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!name) {
    return { isValid: false, sanitized: '', error: 'Nome é obrigatório' };
  }
  
  const trimmed = name.trim();
  
  // Check minimum length
  if (trimmed.length < 2) {
    return { isValid: false, sanitized: trimmed, error: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  // Check maximum length
  if (trimmed.length > 50) {
    return { isValid: false, sanitized: trimmed, error: 'Nome deve ter no máximo 50 caracteres' };
  }
  
  // Reject input containing HTML-like content (angle brackets)
  // This is more secure than trying to sanitize - we simply don't allow it
  if (/<|>/.test(trimmed)) {
    return { isValid: false, sanitized: '', error: 'Nome contém caracteres inválidos' };
  }
  
  // Additional check for potential script injection patterns
  const dangerousPatterns = /javascript:|data:|vbscript:|on\w+\s*=/i;
  if (dangerousPatterns.test(trimmed)) {
    return { isValid: false, sanitized: '', error: 'Nome contém caracteres inválidos' };
  }
  
  return { isValid: true, sanitized: trimmed };
}

/**
 * Creates a safe error message for display to users
 * Prevents exposing internal error details
 * @param error - The error object
 * @returns User-friendly error message
 */
export function getSafeErrorMessage(error: unknown): string {
  // Known safe error messages that can be shown to users
  const safeMessages = [
    'Cupom não encontrado.',
    'Este cupom foi desativado.',
    'Este cupom já foi totalmente utilizado!',
    'Este cupom expirou.'
  ];
  
  if (error instanceof Error) {
    // Only return the message if it's in our list of safe messages
    if (safeMessages.includes(error.message)) {
      return error.message;
    }
  }
  
  // Default generic error message
  return 'Ocorreu um erro. Por favor, tente novamente.';
}
