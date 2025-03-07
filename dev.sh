#!/bin/bash

# 检查提交信息是否提供
if [ -z "$1" ]; then
  echo "错误: 请提供提交信息作为第一个参数。"
  exit 1
fi

# 获取提交信息
COMMIT_MESSAGE="$1"

# 检查是否在 Git 仓库中
if [ ! -d .git ]; then
  echo "错误: 当前目录不是一个 Git 仓库。"
  exit 1
fi

# 设置变量
REMOTE1="origin"
REMOTE2="github"
BRANCHES=("dev")

# 更新所有分支前先 fetch 最新的远程仓库信息
echo "Fetching latest from remote '$REMOTE1'..."
git fetch $REMOTE1 || { echo "错误: Fetch 失败，请检查远程仓库连接。"; exit 1; }
echo "Fetching latest from remote '$REMOTE2'..."
git fetch $REMOTE2 || { echo "错误: Fetch 失败，请检查远程仓库连接。"; exit 1; }

# 遍历每个分支
for BRANCH in "${BRANCHES[@]}"; do
  # 切换到目标分支
  echo "切换到分支 $BRANCH..."
  git checkout $BRANCH || { echo "错误: 切换到分支 $BRANCH 失败。"; exit 1; }

  # 检查是否有未提交的更改
  if ! git diff --quiet || ! git diff --cached --quiet; then
    # 暂存当前更改
    echo "暂存当前更改..."
    git stash || { echo "错误: 暂存更改失败。"; exit 1; }

    # 拉取最新的远程更改
    echo "从远程仓库拉取最新更改..."
    git pull $REMOTE1 $BRANCH || { echo "错误: 拉取远程更改失败。"; exit 1; }

    # 恢复暂存的更改
    echo "恢复暂存的更改..."
    git stash pop || { echo "错误: 恢复暂存更改失败。"; exit 1; }
  else
    # 直接拉取最新的远程更改
    echo "从远程仓库拉取最新更改..."
    git pull $REMOTE1 $BRANCH || { echo "错误: 拉取远程更改失败。"; exit 1; }
  fi

  # 添加所有更改
  echo "添加所有更改到分支 $BRANCH..."
  git add . || { echo "错误: 添加更改失败。"; exit 1; }

  # 检查是否有更改需要提交
  if git diff --cached --quiet; then
    echo "提示: 分支 $BRANCH 没有更改需要提交。"
  else
    # 提交更改
    echo "提交更改到分支 $BRANCH..."
    git commit -m "$COMMIT_MESSAGE" || { echo "错误: 提交到分支 $BRANCH 失败。"; exit 1; }

    # 推送到远程仓库
    echo "推送分支 $BRANCH 到远程仓库 $REMOTE1..."
    git push $REMOTE1 $BRANCH || { echo "错误: 推送分支 $BRANCH 失败。"; exit 1; }

    echo "推送分支 $BRANCH 到远程仓库 $REMOTE2..."
    git push $REMOTE2 $BRANCH || { echo "错误: 推送分支 $BRANCH 失败。"; exit 1; }
  fi
done

# 切换回 dev 分支
echo "切换回 dev 分支..."
git checkout dev || { echo "错误: 切换回 dev 分支失败。"; exit 1; }

echo "操作完成。"
read -p "按任意键继续..."
