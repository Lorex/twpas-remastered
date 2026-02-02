/**
 * @file login.ts
 * @description Login authentication logic with account lockout protection
 */

// 帳號鎖定設定
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 分鐘

// 登入失敗記錄 (實際應用應存於 Redis 或資料庫)
interface FailedAttempt {
  count: number;
  lockedUntil: number | null;
}

const failedAttempts = new Map<string, FailedAttempt>();

export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    username: string;
    role: string;
  };
}

export interface User {
  username: string;
  password: string;
  role: string;
  status: '啟用' | '停用';
}

/**
 * 檢查帳號是否被鎖定
 */
export function isAccountLocked(username: string): boolean {
  const record = failedAttempts.get(username);
  if (!record || !record.lockedUntil) {
    return false;
  }

  if (Date.now() > record.lockedUntil) {
    // 鎖定已過期，清除記錄
    failedAttempts.delete(username);
    return false;
  }

  return true;
}

/**
 * 記錄登入失敗
 */
export function recordFailedAttempt(username: string): void {
  const record = failedAttempts.get(username) || { count: 0, lockedUntil: null };
  record.count += 1;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  failedAttempts.set(username, record);
}

/**
 * 清除登入失敗記錄 (登入成功時呼叫)
 */
export function clearFailedAttempts(username: string): void {
  failedAttempts.delete(username);
}

/**
 * 取得失敗嘗試次數
 */
export function getFailedAttemptCount(username: string): number {
  return failedAttempts.get(username)?.count || 0;
}

/**
 * 驗證登入
 */
export async function login(
  username: string,
  password: string,
  findUser: (username: string) => Promise<User | null>
): Promise<LoginResult> {
  // 檢查空白輸入
  if (!username || !password) {
    return { success: false, error: '請輸入帳號和密碼' };
  }

  // 檢查帳號是否被鎖定
  if (isAccountLocked(username)) {
    return { success: false, error: '帳號已被鎖定，請在 15 分鐘後重試' };
  }

  // 查找使用者
  const user = await findUser(username);

  // 帳號不存在或密碼錯誤
  if (!user || user.password !== password) {
    recordFailedAttempt(username);

    // 檢查是否達到鎖定門檻
    if (isAccountLocked(username)) {
      return { success: false, error: '帳號已被鎖定，請在 15 分鐘後重試' };
    }

    return { success: false, error: '帳號或密碼錯誤' };
  }

  // 帳號已停用
  if (user.status === '停用') {
    return { success: false, error: '帳號已停用，請聯繫管理員' };
  }

  // 登入成功，清除失敗記錄
  clearFailedAttempts(username);

  return {
    success: true,
    user: {
      username: user.username,
      role: user.role,
    },
  };
}

/**
 * 重設鎖定狀態 (供測試或管理用)
 */
export function resetAllLockouts(): void {
  failedAttempts.clear();
}
