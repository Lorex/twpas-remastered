/**
 * @file login.test.ts
 * @description Unit tests for login functionality
 * @bdd-generated: features/auth/login.feature
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  login,
  isAccountLocked,
  recordFailedAttempt,
  clearFailedAttempts,
  getFailedAttemptCount,
  resetAllLockouts,
  type User,
  type LoginResult,
} from '../login';

// 測試用使用者資料
const testUsers: Record<string, User> = {
  doctor01: { username: 'doctor01', password: 'Pass1234!', role: '醫師', status: '啟用' },
  inactive_user: { username: 'inactive_user', password: 'Pass1234!', role: '醫師', status: '停用' },
};

// Mock findUser 函式
const findUser = async (username: string): Promise<User | null> => {
  return testUsers[username] || null;
};

describe('登入功能', () => {
  beforeEach(() => {
    // 每個測試前重設鎖定狀態
    resetAllLockouts();
  });

  describe('使用有效帳號密碼登入', () => {
    it('應該成功登入並回傳使用者資訊', async () => {
      const result = await login('doctor01', 'Pass1234!', findUser);

      expect(result.success).toBe(true);
      expect(result.user?.username).toBe('doctor01');
      expect(result.user?.role).toBe('醫師');
      expect(result.error).toBeUndefined();
    });
  });

  describe('使用錯誤密碼登入', () => {
    it('應該回傳錯誤訊息', async () => {
      const result = await login('doctor01', 'WrongPassword', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('帳號或密碼錯誤');
    });
  });

  describe('使用不存在的帳號登入', () => {
    it('應該回傳錯誤訊息', async () => {
      const result = await login('nonexistent_user', 'Pass1234!', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('帳號或密碼錯誤');
    });
  });

  describe('使用停用帳號登入', () => {
    it('應該回傳帳號已停用錯誤', async () => {
      const result = await login('inactive_user', 'Pass1234!', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('帳號已停用，請聯繫管理員');
    });
  });

  describe('空白帳號或密碼登入', () => {
    it('帳號為空時應該回傳錯誤', async () => {
      const result = await login('', 'Pass1234!', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('請輸入帳號和密碼');
    });

    it('密碼為空時應該回傳錯誤', async () => {
      const result = await login('doctor01', '', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('請輸入帳號和密碼');
    });

    it('帳號密碼都為空時應該回傳錯誤', async () => {
      const result = await login('', '', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('請輸入帳號和密碼');
    });
  });

  describe('連續登入失敗後鎖定帳號', () => {
    it('連續失敗 5 次後應該鎖定帳號', async () => {
      // 連續嘗試 5 次錯誤密碼
      for (let i = 0; i < 5; i++) {
        await login('doctor01', 'WrongPassword', findUser);
      }

      // 第 6 次嘗試應該顯示鎖定訊息
      const result = await login('doctor01', 'Pass1234!', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('帳號已被鎖定，請在 15 分鐘後重試');
    });

    it('帳號被鎖定時即使密碼正確也無法登入', async () => {
      // 鎖定帳號
      for (let i = 0; i < 5; i++) {
        await login('doctor01', 'WrongPassword', findUser);
      }

      // 使用正確密碼嘗試
      const result = await login('doctor01', 'Pass1234!', findUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('帳號已被鎖定，請在 15 分鐘後重試');
    });

    it('成功登入後應該清除失敗記錄', async () => {
      // 失敗 3 次
      for (let i = 0; i < 3; i++) {
        await login('doctor01', 'WrongPassword', findUser);
      }

      expect(getFailedAttemptCount('doctor01')).toBe(3);

      // 成功登入
      await login('doctor01', 'Pass1234!', findUser);

      expect(getFailedAttemptCount('doctor01')).toBe(0);
    });
  });

  describe('帳號鎖定輔助函式', () => {
    it('isAccountLocked 應該正確判斷鎖定狀態', () => {
      expect(isAccountLocked('doctor01')).toBe(false);

      // 觸發鎖定
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt('doctor01');
      }

      expect(isAccountLocked('doctor01')).toBe(true);
    });

    it('clearFailedAttempts 應該清除失敗記錄', () => {
      recordFailedAttempt('doctor01');
      recordFailedAttempt('doctor01');

      expect(getFailedAttemptCount('doctor01')).toBe(2);

      clearFailedAttempts('doctor01');

      expect(getFailedAttemptCount('doctor01')).toBe(0);
    });
  });
});
