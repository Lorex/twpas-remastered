# language: zh-TW
@auth @oauth
功能: OAuth2 登入
  作為一個系統使用者
  我想要能夠透過 OAuth2 (Keycloak) 登入系統
  以便使用單一登入機制

  背景:
    假設 系統已經啟動
    並且 Keycloak 服務已配置完成
    並且 Keycloak 中存在以下使用者:
      | 帳號      | 角色     |
      | kc_user01 | 醫師     |
      | kc_user02 | 藥師     |

  @happy-path
  場景: 透過 Keycloak OAuth2 登入
    當 我在登入頁面
    並且 我點擊 "使用 Keycloak 登入" 按鈕
    那麼 我應該被重導到 Keycloak 登入頁面
    當 我在 Keycloak 輸入帳號 "kc_user01"
    並且 我在 Keycloak 輸入密碼 "Pass1234!"
    並且 我在 Keycloak 點擊登入
    那麼 我應該被重導回系統
    並且 我應該看到儀表板頁面
    並且 系統應該建立本地使用者記錄

  場景: OAuth2 登入後自動建立本地帳號
    假設 本地資料庫中不存在使用者 "kc_user02"
    當 我透過 Keycloak 以 "kc_user02" 登入成功
    那麼 系統應該自動建立本地使用者
    並且 本地使用者應該關聯 Keycloak ID
    並且 使用者角色應該為 "藥師"

  場景: OAuth2 登入失敗 - Keycloak 驗證失敗
    當 我在登入頁面
    並且 我點擊 "使用 Keycloak 登入" 按鈕
    並且 我在 Keycloak 輸入錯誤的帳號密碼
    那麼 我應該看到 Keycloak 的錯誤訊息
    並且 我應該仍在 Keycloak 登入頁面

  場景: OAuth2 登入 - Keycloak 服務不可用
    假設 Keycloak 服務暫時不可用
    當 我在登入頁面
    並且 我點擊 "使用 Keycloak 登入" 按鈕
    那麼 我應該看到錯誤訊息 "認證服務暫時不可用，請稍後再試"
    並且 系統應該記錄錯誤日誌

  場景: OAuth2 Token 刷新
    假設 我已經透過 OAuth2 登入
    並且 我的 Access Token 即將過期
    當 我發送任何 API 請求
    那麼 系統應該自動刷新 Token
    並且 我的請求應該正常完成
    並且 我不需要重新登入
