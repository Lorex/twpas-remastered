/**
 * TWPAS Shared JavaScript
 * Common utilities for all pages in the mock-app
 */

// ============================================================================
// Cookie Utilities
// ============================================================================

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until expiration (default: 1)
 */
function setCookie(name, value, days = 1) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
}

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 */
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// ============================================================================
// Authentication
// ============================================================================

/**
 * Check if user is authenticated, redirect to login if not
 * @param {boolean} redirectOnFail - Whether to redirect to login on failure (default: true)
 * @returns {object|null} User object if authenticated, null otherwise
 */
function checkAuth(redirectOnFail = true) {
  const authCookie = getCookie('twpas_auth');
  const userStr = sessionStorage.getItem('user');

  if (!authCookie || !userStr) {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('loginTime');
    if (redirectOnFail) {
      window.location.href = '/login?expired=true';
    }
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (e) {
    if (redirectOnFail) {
      window.location.href = '/login?expired=true';
    }
    return null;
  }
}

/**
 * Logout the current user
 */
function logout() {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('loginTime');
  deleteCookie('twpas_auth');
  window.location.href = '/login';
}

/**
 * Display user information in the header
 * @param {string} usernameElementId - ID of element to display username
 * @param {string} roleElementId - ID of element to display role badge
 * @param {string} welcomeElementId - Optional ID of element to display welcome name
 */
function displayUserInfo(usernameElementId = 'username-display', roleElementId = 'user-role-badge', welcomeElementId = null) {
  const user = checkAuth();
  if (!user) return;

  const usernameEl = document.getElementById(usernameElementId);
  const roleEl = document.getElementById(roleElementId);
  const welcomeEl = welcomeElementId ? document.getElementById(welcomeElementId) : null;

  if (usernameEl) {
    usernameEl.textContent = user.username || '';
  }
  if (roleEl) {
    roleEl.textContent = user.role || '';
  }
  if (welcomeEl) {
    welcomeEl.textContent = user.username || '';
  }

  return user;
}

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Format today's date in Traditional Chinese format
 * @returns {string} Formatted date string
 */
function formatTodayZhTW() {
  const today = new Date();
  return today.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

/**
 * Calculate age from birth date
 * @param {string} birthDate - Birth date string (YYYY-MM-DD)
 * @returns {number} Age in years
 */
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ============================================================================
// ID Masking Utilities
// ============================================================================

/**
 * Mask a Taiwan ID number for privacy
 * @param {string} id - Full ID number
 * @returns {string} Masked ID (e.g., "A123***789")
 */
function maskIdNumber(id) {
  if (!id || id.length < 10) return id;
  return id.substring(0, 4) + '***' + id.substring(7);
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Get URL query parameters
 * @returns {URLSearchParams} URL search params object
 */
function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * Get a specific URL parameter
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null
 */
function getUrlParam(name) {
  return getUrlParams().get(name);
}

// ============================================================================
// Modal Utilities
// ============================================================================

/**
 * Open a modal by ID
 * @param {string} modalId - Modal element ID
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

/**
 * Close a modal by ID
 * @param {string} modalId - Modal element ID
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize page with auth check and user display
 * Call this at the end of page-specific scripts
 */
function initPage() {
  return displayUserInfo();
}
