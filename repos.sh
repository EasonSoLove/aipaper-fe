#!/bin/bash

# 捕获所有退出信号，确保在任何退出时都执行最后的 read 操作
trap 'echo "按任意键继续..."; read -n 1' EXIT

# 设置变量
REMOTE_ORIGIN="origin"  # 远程仓库 origin
REMOTE_GITHUB="github"  # 远程仓库 github
BRANCHES=("dev" "main")  # 需要推送的分支
MESSAGE="部署更改"  # 默认提交信息

# 检查是否有传递的提交信息
if [ ! -z "$1" ]; then
  MESSAGE="$1"
fi

# 获取最新的标签并自增
get_next_tag() {
  # 获取所有标签并排序，取最后一个
  latest_tag=$(git tag --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1)

  if [ -z "$latest_tag" ]; then
    echo "v1.0.1" # 如果没有标签，默认返回 v1.0.1
  else
    # 解析版本号
    IFS='.' read -r -a parts <<< "${latest_tag:1}" # 去掉 'v' 并分割
    major=${parts[0]}
    minor=${parts[1]}
    patch=${parts[2]}

    # 自增 patch 版本号
    if [ "$patch" -lt 99 ]; then
      new_patch=$((patch + 1))
      new_minor=$minor
    else
      new_patch=0
      new_minor=$((minor + 1))
    fi

    # 生成新标签
    echo "v$major.$new_minor.$new_patch"
  fi
}

# 生成新的标签名称
TAG_NAME=$(get_next_tag)
echo "新标签名称为: $TAG_NAME"

# 确保是在一个Git仓库中
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "此脚本必须在 git 仓库中运行。"
  exit 1
fi

# 验证远程仓库是否存在
for REMOTE in "$REMOTE_ORIGIN" "$REMOTE_GITHUB"; do
  if ! git remote | grep -q "$REMOTE"; then
    echo "远程仓库 '$REMOTE' 不存在。"
    exit 1
  fi
done

# 获取当前分支名称
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 检查当前分支是否是 dev 或 main，如果不是则切换到 dev
if [[ "$CURRENT_BRANCH" != "dev" && "$CURRENT_BRANCH" != "main" ]]; then
  echo "当前分支 '$CURRENT_BRANCH' 不是 dev 或 main，切换到 dev 分支..."
  git checkout dev || { echo "切换到 dev 分支失败"; exit 1; }
  CURRENT_BRANCH="dev"
fi

# 检查是否有未提交的更改
STASHED=false
if ! git diff-index --quiet HEAD --; then
  # 暂存当前更改
  echo "暂存当前更改..."
  git stash || { echo "暂存更改失败"; exit 1; }
  STASHED=true
fi

# 拉取最新的代码
echo "从 $REMOTE_ORIGIN/$CURRENT_BRANCH 拉取最新代码..."
git pull $REMOTE_ORIGIN $CURRENT_BRANCH || { echo "拉取代码失败"; exit 1; }

# 如果有暂存的更改，恢复它们
if $STASHED; then
  echo "恢复暂存的更改..."
  git stash pop || { echo "恢复暂存的更改失败"; exit 1; }
fi

# 检查是否有任何更改需要提交
if ! git diff-index --cached --quiet HEAD -- || ! git diff --quiet; then
  # 添加所有更改
  echo "添加所有更改..."
  git add .

  # 提交更改
  echo "使用消息 '$MESSAGE' 提交更改..."
  git commit -m "$MESSAGE" || { echo "提交失败"; exit 1; }
fi

# 只推送当前分支（dev 或 main）到对应的远程分支
echo "向 $REMOTE_ORIGIN/$CURRENT_BRANCH 推送更改..."
git push $REMOTE_ORIGIN $CURRENT_BRANCH || { echo "推送到 $REMOTE_ORIGIN/$CURRENT_BRANCH 失败"; exit 1; }

echo "向 $REMOTE_GITHUB/$CURRENT_BRANCH 推送更改..."
git push $REMOTE_GITHUB $CURRENT_BRANCH || { echo "推送到 $REMOTE_GITHUB/$CURRENT_BRANCH 失败"; exit 1; }

# 切换到 main 分支
echo "切换到 main 分支..."
git checkout main || { echo "切换到 main 分支失败"; exit 1; }

# 拉取最新的 main 分支代码
echo "从 $REMOTE_ORIGIN/main 拉取最新代码..."
git pull $REMOTE_ORIGIN main || { echo "拉取 main 分支代码失败"; exit 1; }

# 合并 dev 分支到 main 分支
echo "合并 dev 分支到 main 分支..."
git merge --no-ff dev || { echo "合并过程中出现冲突，请手动解决冲突后继续。"; exit 1; }

# 再次拉取以确保没有新提交（解决推送失败的问题）
echo "从 $REMOTE_ORIGIN/main 再次拉取以确保同步..."
git pull $REMOTE_ORIGIN main || { echo "再次拉取 main 分支代码失败"; exit 1; }

# 推送合并后的 main 分支到 origin 仓库
echo "向 $REMOTE_ORIGIN/main 推送合并后的 main 分支..."
git push $REMOTE_ORIGIN main || { echo "推送合并后的 main 分支失败"; exit 1; }

# 推送合并后的 main 分支到 github 仓库
echo "向 $REMOTE_GITHUB/main 推送合并后的 main 分支..."
git push $REMOTE_GITHUB main || { echo "推送合并后的 main 分支失败"; exit 1; }

# 创建标签
echo "创建标签 $TAG_NAME..."
git tag $TAG_NAME || { echo "创建标签失败"; exit 1; }

# 推送标签到 origin 仓库
echo "向 $REMOTE_ORIGIN 推送标签 $TAG_NAME..."
git push $REMOTE_ORIGIN $TAG_NAME || { echo "推送标签失败"; exit 1; }

# 推送标签到 github 仓库
echo "向 $REMOTE_GITHUB 推送标签 $TAG_NAME..."
git push $REMOTE_GITHUB $TAG_NAME || { echo "推送标签失败"; exit 1; }

# 切换到开发分支
git checkout dev || { echo "切换到开发分支失败"; exit 1; }
echo "部署完成！"
