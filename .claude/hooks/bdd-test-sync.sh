#!/bin/bash
# BDD Test Sync Hook
# 當 .feature 檔案被編輯後觸發，指示 Claude 執行 bdd-test-sync agent

# 從環境變數取得工具輸入檔案
INPUT_FILE="${TOOL_INPUT_FILE:-}"

if [ -z "$INPUT_FILE" ] || [ ! -f "$INPUT_FILE" ]; then
    exit 0
fi

# 從 JSON 輸入中提取檔案路徑
FILE_PATH=$(cat "$INPUT_FILE" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"file_path"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')

# 如果無法取得檔案路徑，嘗試其他欄位名稱
if [ -z "$FILE_PATH" ]; then
    FILE_PATH=$(cat "$INPUT_FILE" | grep -o '"path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"path"[[:space:]]*:[[:space:]]*"//' | sed 's/"$//')
fi

# 檢查是否為 .feature 檔案
if [[ "$FILE_PATH" == */features/*.feature ]] || [[ "$FILE_PATH" == features/*.feature ]]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 BDD 檔案已變更: $FILE_PATH"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "請執行 bdd-test-sync agent 來同步測試："
    echo ""
    echo ">>> 請同步 $FILE_PATH 的測試腳本"
    echo ""
fi
