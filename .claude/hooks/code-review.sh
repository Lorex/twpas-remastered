#!/bin/bash
# Code Review Hook
# 當實作檔案被建立或修改後觸發，指示 Claude 執行程式碼審查

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

# 排除的檔案模式
IS_EXCLUDED=false

# 排除測試檔案
if [[ "$FILE_PATH" == *.spec.ts ]] || [[ "$FILE_PATH" == *.test.ts ]]; then
    IS_EXCLUDED=true
fi

# 排除 feature 檔案
if [[ "$FILE_PATH" == *.feature ]]; then
    IS_EXCLUDED=true
fi

# 排除設定檔和 hooks
if [[ "$FILE_PATH" == */.claude/* ]]; then
    IS_EXCLUDED=true
fi

# 排除 node_modules
if [[ "$FILE_PATH" == */node_modules/* ]]; then
    IS_EXCLUDED=true
fi

# 排除 lock 檔案
if [[ "$FILE_PATH" == *lock.json ]] || [[ "$FILE_PATH" == *lock.yaml ]]; then
    IS_EXCLUDED=true
fi

# 只處理 src/ 或 app/ 目錄下的 TypeScript/JavaScript 檔案
IS_IMPL_FILE=false

if [[ "$FILE_PATH" == */src/*.ts ]] || [[ "$FILE_PATH" == */src/*.tsx ]] || \
   [[ "$FILE_PATH" == */src/*.js ]] || [[ "$FILE_PATH" == */src/*.jsx ]] || \
   [[ "$FILE_PATH" == src/*.ts ]] || [[ "$FILE_PATH" == src/*.tsx ]] || \
   [[ "$FILE_PATH" == */app/*.ts ]] || [[ "$FILE_PATH" == */app/*.tsx ]] || \
   [[ "$FILE_PATH" == app/*.ts ]] || [[ "$FILE_PATH" == app/*.tsx ]]; then
    IS_IMPL_FILE=true
fi

# 如果是實作檔案且未被排除
if [ "$IS_IMPL_FILE" = true ] && [ "$IS_EXCLUDED" = false ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 實作檔案已變更: $FILE_PATH"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "請執行程式碼審查："
    echo ""
    echo ">>> 請對 $FILE_PATH 進行程式碼審查"
    echo ""
fi
