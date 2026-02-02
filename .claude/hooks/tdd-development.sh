#!/bin/bash
# TDD Development Hook
# 當測試檔案被 bdd-test-sync 建立或修改後觸發，指示 Claude 執行 TDD 開發

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

# 檢查是否為 BDD 生成的測試檔案
IS_BDD_TEST=false

# 檢查 E2E 測試 (e2e/**/*.spec.ts)
if [[ "$FILE_PATH" == */e2e/*.spec.ts ]] || [[ "$FILE_PATH" == e2e/*.spec.ts ]]; then
    # 檢查檔案是否包含 @bdd-generated 標記
    if [ -f "$FILE_PATH" ] && grep -q "@bdd-generated" "$FILE_PATH" 2>/dev/null; then
        IS_BDD_TEST=true
    fi
fi

# 檢查 Unit 測試 (src/**/__tests__/*.test.ts 或 src/**/*.test.ts)
if [[ "$FILE_PATH" == */src/*test*.ts ]] || [[ "$FILE_PATH" == src/*test*.ts ]]; then
    # 檢查檔案是否包含 @bdd-generated 標記
    if [ -f "$FILE_PATH" ] && grep -q "@bdd-generated" "$FILE_PATH" 2>/dev/null; then
        IS_BDD_TEST=true
    fi
fi

if [ "$IS_BDD_TEST" = true ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 BDD 測試已同步: $FILE_PATH"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "請執行 TDD 開發流程："
    echo ""
    echo ">>> 請根據 $FILE_PATH 進行 TDD 開發，實作功能直到所有測試通過"
    echo ""
fi
