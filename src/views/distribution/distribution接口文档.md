8 月需求-二级分销和管理后台设计文档
管理后台
待定

二级分销
二级分销活动页面是一个单独的页面，如下图所示： 1.左上角是 MixPaper，中间是“邀请有礼”、“去写作”，右侧是用户头像
a.点击 MixPaper，可以回到首页
b.点击“邀请有礼”，是当前页面
c.点击“去写作”，进入写作页面
d.头像功能不变 2.营销活动图片
a.点击图片，页面滚动到“邀请好友”的位置 3.横向滚动（从右向左）
a.内容示例：P\***_l 邀请 O_**1 加入了万象写作 4.活动奖励
a.现金奖励：红色下划线
i.您至高获得实付金额 30%的现金分成
ii.现金奖励明细，点击弹出弹窗。说明分成规则、分销协议
b.虚拟物品奖励（只送两个，可在后台管理配置）：
i.正文优惠券
ii.降 AIGC 次数 5.邀请好友：
a.复制链接邀请
b.生成分享海报
i.应该提供几个模板
ii.让用户选择其中一个模版，生成后自动下载
c.已邀请 XX 人
i.已邀请的记录列表 6.我的推广
a.需要有一个横向的条幅，高度为两行文本
i.成为专属分享商
ii.解锁间推奖励，获取更高分成
b.累计佣金
i.可提现 + 已提现的金额
c.直推分成比例
d.间推分成比例
e.可提现
i.钱直接在 tab 上展示
ii.列表展示可结算的佣金记录
f.已提现
i.钱直接在 tab 上展示
ii.列表展示提现申请
g.待结算
i.钱直接在 tab 上展示
ii.列表展示待结算的佣金记录 7.常见问题

1. 邀请码设计
   •邀请码基于用户 Id 进行加密、Hash、加盐后生成
   •其他用户使用邀请码登录时，基于邀请码的规则反推出邀请人，双方进行绑定
   •user 表新增字段：parent_user_id，表示当前用户的邀请人
2. Login 服务
   2.1 新用户注册（仅后端）
   ☑ 新用户注册时，需要创建一个分销商账户
   ☑ 新用户注册时，基于手机号和加盐规则，随机生成一个默认用户名
   ☑ 用户登录后更新最后一次登录时间
   ☑ 新用户注册时，如果通过邀请链接注册，需要记录
   □ 新用户注册时，如果通过邀请连接注册，需要赠送权益

3. 分销页面
   3.1 刷新推广数据
   •每次进入页面优先调用这个接口
   •该接口使用强制认证，用户未登录点击会返回 401
   3.1.1 业务逻辑 1.每半个小时自动执行一次，刷新所有分销商的数据 2.前端调用是分销商刷新自己的数据 3.分销商自己点击刷新之后，该接口只负责刷新。响应成功之后需要前端调用/base_info 接口获取最新的数据

3.1.2 接口地址
GET /api/ai-paper/distribution/refresh_account
3.1.3 请求参数
无
3.1.4 响应示例
SQL
{
"code": 200,
"message": "success",
"result": null
}
3.2 获取分销商基础信息
•基础信息包含以下信息：
a.邀请链接
b.已邀请人数
c.直推分成比例
d.间推分成比例
e.累计佣金
f.可提现金额
g.已提现金额
h.待结算金额
•当前接口不强制认证，无论是否登录都会正常响应数据
3.2.1 接口地址
GET /api/ai-paper/distribution/base_info
3.2.2 请求参数
无
3.2.3 响应示例
成功响应（未登录）：
JSON
{
"code": 200,
"message": "success",
"result": {
"distribution_name": "请登录",
"distribution_account_status": "NORMAL",
"inv_code_url": "请登录",
"inv_user_num": 0,
"currency": "CNY",
"direct_rewards": 0,
"indirect_rewards": 0,
"balance": 0,
"frozen_amount": 0,
"withdrawn_amount": 0,
"total_income": 0,
"question_and_answer": "待配置",
"is_login": false
}
}
成功响应（已登录）：
JSON
{
"code": 200,
"message": "success",
"result": {
"distribution_name": "等天黑",
"distribution_account_status": "NORMAL",
"inv_code_url": "https://www.mixpaper.cn/#/login?invCode=Hv2Dpj",
"inv_user_num": 1,
"currency": "CNY",
"direct_rewards": 0.2,
"indirect_rewards": 0,
"balance": 109.54,
"frozen_amount": 108.56,
"withdrawn_amount": 400,
"total_income": 509,
"question_and_answer": "待配置",
"is_login": true
}
}

3.3 分页查询邀请记录
•进入活动页需要判断用户是否登录
￮用户未登录的时候不调用接口，展示“暂无数据”
￮用户已登录则正常调用接口
•该接口使用强制认证，用户未登录点击会返回 401
3.3.1 接口地址
GET /api/ai-paper/distribution/inv_records
3.3.2 请求参数（Query）
字段 类型 必填 说明
page_num
Integer 否 页数，不传默认为 1
page_size Integer 是 每页记录数，不传默认为 10
3.3.3 响应示例
JSON
{
"code": 200,
"message": "success",
"result": {
"page_num": "1",
"page_size": "10",
"total": 1,
"invited_record_list": [
{
"invitee_name": "test 被邀请人", // 被邀请人
"registration_time": "2025-07-25T15:25:56+08:00", // 注册时间
"invitee_rewards": "待定义", // 被邀请人奖励
"inviter_rewards": "待定义", // 邀请人奖励
"remarks": "" // 备注
}
]
}
}

3.4 可提现查询（分页）
•进入活动页需要判断用户是否登录
￮用户未登录的时候不调用接口，展示“暂无数据”
￮用户已登录则正常调用接口
•该接口使用强制认证，用户未登录点击会返回 401
3.4.1 业务逻辑
查询 distribution_account_vir_logs 表当前时间 - settle_flow_time >= 7 天的数据，按照 create_time 倒序排序
3.4.2 接口地址
GET /api/ai-paper/distribution/withdrawal_records
3.4.3 请求参数（Query）
字段 类型 必填 说明
page_num
Integer 否 页数，不传默认为 1
page_size Integer 是 每页记录数，不传默认为 10
3.4.4 响应示例
JSON
{
"code": 200,
"message": "success",
"result": {
"page_num": "1",
"page_size": "10",
"total": 1,
"withdrawal_record_list": null,
"settling_record_list": [
{
"distribution_change_type": "USER_CONSUME", // 变动类型
"change_amount": 27, // 变动金额
"trade_no": "b231530f-5496-4f30-8d89-0814ed1e1f89", // 关联单号
"created_time": "2025-07-24T17:46:13+08:00" // 交易发生时间
}
]
}
}

3.5 已提现查询
•进入活动页不自动触发该接口，用户手动在列表上点击才触发查询
•该接口使用强制认证，用户未登录点击会返回 401
3.5.1 业务逻辑
查询提现申请表的记录
3.5.2 接口地址
3.5.3 请求参数（Query）
3.5.4 响应示例

3.6 待结算查询（分页）
•进入活动页不自动触发该接口，用户手动在列表上点击才触发查询
•该接口使用强制认证，用户未登录点击会返回 401
3.6.1 业务逻辑
查询 distribution_account_logs 表当前时间 - settle_flow_time < 7 天的数据
3.6.2 接口地址
GET /api/ai-paper/distribution/waiting_settle_records
3.6.3 请求参数（Query）
字段 类型 必填 说明
page_num
Integer 否 页数，不传默认为 1
page_size Integer 是 每页记录数，不传默认为 10
3.6.4 响应示例
JSON
{
"code": 200,
"message": "success",
"result": {
"page_num": "1",
"page_size": "10",
"total": 1,
"withdrawal_record_list": null,
"settling_record_list": [
{
"distribution_change_type": "USER_CONSUME", // 变动类型
"change_amount": 27, // 变动金额
"trade_no": "b231530f-5496-4f30-8d89-0814ed1e1f89", // 关联单号
"created_time": "2025-07-24T17:46:13+08:00" // 交易发生时间
}
]
}
}

4. 后台管理
   4.1 权限设计 1.不使用 RBAC 权限模型，工作量太大 2.基于 user 表 permission 字段，扩展 permisson_menus 表和 permission_buttons 表 3.用户登录后基于用户权限获取其可查看的菜单 4.用户进入菜单后基于用户权限获取其可执行操作的按钮，不具有权限的操作按钮不予展示 5.不同权限的用户拥有不同的默认权限，超级管理员可以针对单个用户配置额外的权限

5. 全局码值表
   已有接口 GET /api/ai-paper/home/global_code
   需要翻译的字段 码值字段
   distribution_change_type distribution_change_type_code

6. SQL
   SQL
   -- 删除 account 表、account_logs 表，这两个表无用
   DROP table IF EXISTS account;
   DROP table IF EXISTS account_logs;

-- user 表增加字段
alter table `user` add parent_user_id BIGINT after agent_id;

-- user 表增加索引
CREATE INDEX idx_invite ON `user` (`parent_user_id`);
CREATE INDEX idx_registry ON `user` (`registration_time`);

-- 新增 invitation_logs 表
DROP TABLE IF EXISTS invitation_logs;
CREATE TABLE `invitation_logs`
(
`id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
`invitee_id` BIGINT NOT NULL COMMENT '被邀请人 Id',
`invitee_name` VARCHAR(50) NOT NULL COMMENT '被邀请人用户名',
`inviter_id` BIGINT NOT NULL COMMENT '邀请人 Id',
`invitee_rewards_type` VARCHAR(10) COMMENT '被邀请人奖励类型，对应奖励设置',
`inviter_rewards_type` VARCHAR(10) COMMENT '邀请人奖励类型，对应奖励设置',
`remarks` VARCHAR(50) COMMENT '备注',
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
PRIMARY KEY (`id`),
UNIQUE KEY `idx_invitee_id` (`invitee_id`),
KEY `idx_inviter_id` (`inviter_id`)
) COMMENT ='邀请记录表';

-- 新增 distribution_account 表
DROP TABLE IF EXISTS distribution_account;
CREATE TABLE `distribution_account`
(
`id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
`user_id` BIGINT NOT NULL COMMENT 'user 表 id',
`currency` VARCHAR(3) NOT NULL COMMENT '币种，CNY-人民币、USD-美元，默认：CNY',
`balance` DECIMAL(10, 2) DEFAULT 0.0 NOT NULL COMMENT '账户余额，两位小数',
`frozen_amount` DECIMAL(10, 2) DEFAULT 0.0 NOT NULL COMMENT '待结算金额，两位小数',
`withdrawn_amount` DECIMAL(10, 2) DEFAULT 0.0 NOT NULL COMMENT '已提现金额，两位小数',
`total_income` DECIMAL(10, 2) DEFAULT 0.0 NOT NULL COMMENT '总收益，两位小数',
`direct_percent` DECIMAL(2, 1) DEFAULT 0.2 NOT NULL COMMENT '直推分成比例：普通用户默认 20%，升级为代理后默认 30%',
`indirect_percent` DECIMAL(2, 1) DEFAULT 0.2 NOT NULL COMMENT '间推分成比例：普通用户默认 0%，升级为代理后默认 10%',
`user_upgrade_percent` DECIMAL(2, 1) DEFAULT 0.8 NOT NULL COMMENT '代理费分成：普通用户默认 0%，升级为代理后默认 80%。解释：如果代理用户直推的用户付费升级成为代理，付费金额按照该比例分成',
`status` VARCHAR(10) DEFAULT 'NORMAL' NOT NULL COMMENT '账户状态，NORMAL-正常、FROZEN-冻结、CLOSED-关闭，默认：NORMAL',
`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '账户创建时间',
`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '账户更新时间',
PRIMARY KEY (`id`),
KEY `idx_userid` (`user_id`)
) COMMENT ='分销商账户表';

-- 给已存在的用户建立对应的分销商账户
insert into distribution_account(user_id, currency, balance, frozen_amount, withdrawn_amount, total_income,
direct_percent,
indirect_percent,
user_upgrade_percent, status)
select u.id,
'CNY',
0.0,
0.0,
0.0,
0.0,
IF(u.permission = 'AGENT', 0.3, 0.2),
IF(u.permission = 'AGENT', 0.1, 0.0),
IF(u.permission = 'AGENT', 0.8, 0.0),
'NORMAL'
from user u
where not exists(select 1 from distribution_account da where da.user_id = u.id);

-- 新增 distribution_account_vir_logs 表
DROP TABLE IF EXISTS distribution_account_vir_logs;
CREATE TABLE `distribution_account_vir_logs`
(
`id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
`account_id` BIGINT NOT NULL COMMENT 'account 表 id',
`change_type` VARCHAR(20) NOT NULL COMMENT '变动类型：USER_CONSUME-用户订单消费，USER_REFUND-用户订单退款，USER_UPGRADE-用户升级的代理费，WITHDRAWN-提现，WITHDRAWN_BACK-提现失败退回',
`change_amount` DECIMAL(10, 2) NOT NULL COMMENT '变动的金额, 2 位小数',
`order_out_trade_no` VARCHAR(255) COMMENT 'order 表 out_trade_no, 必须记录订单号',
`withdraw_trade_no` VARCHAR(255) COMMENT 'withdraw 表 trade_no, 提现必须记录提现单号',
`settle_flow` VARCHAR(20) NOT NULL COMMENT '资金变动流程：NEW-新建，ADDED_FROZEN-已统计至待结算，ADDED_BALANCE-已统计至可提现，END-结束',
`created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '流水创建时间，禁止更改',
`settle_flow_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '资金流程变动依赖的开始时间，禁止更改。资金变动为负数时（比如退款等），该字段必须原始 distribution_account_logs 记录的 settle_flow_time 一致，以保证同一笔订单产生的资金变动能够对冲',
`updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '流水更新时间',
PRIMARY KEY (`id`),
KEY `idx_account_id` (`account_id`)
) COMMENT ='分销商账户虚拟变动流水表（资金变动先进虚拟表，由自动任务基于规则统一变更 distribution_account 表）';

-- 新增 distribution_account_real_logs 表
DROP TABLE IF EXISTS distribution_account_real_logs;
CREATE TABLE `distribution_account_real_logs`
(
`id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '自增主键',
`account_id` BIGINT NOT NULL COMMENT 'account 表 id',
`vir_logs_id` BIGINT NOT NULL COMMENT 'distribution_account_vir_logs 表的 id',
`change_type` VARCHAR(20) NOT NULL COMMENT '变动类型：USER_CONSUME-用户订单消费，USER_REFUND-用户订单退款，USER_UPGRADE-用户升级的代理费，WITHDRAWN-提现，WITHDRAWN_BACK-提现失败退回',
`change_field` VARCHAR(20) NOT NULL COMMENT 'distribution_account 表中发生资金变动的字段',
`previous_amount` DECIMAL(10, 2) NOT NULL COMMENT '变动前的金额, 2 位小数',
`change_amount` DECIMAL(10, 2) NOT NULL COMMENT '变动的金额, 2 位小数',
`post_amount` DECIMAL(10, 2) NOT NULL COMMENT '变动后的金额, 2 位小数',
`order_out_trade_no` VARCHAR(255) COMMENT 'order 表 out_trade_no, 必须记录订单号',
`withdraw_trade_no` VARCHAR(255) COMMENT 'withdraw 表 trade_no, 提现必须记录提现单号',
`created_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '流水创建时间，禁止更改',
`updated_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '流水更新时间',
PRIMARY KEY (`id`),
KEY `idx_account_id` (`account_id`)
) COMMENT ='分销商账户真实变动流水（在 distribution_account 真正发生资金变动时记录）';

-- 新增 distribution_withdraw 表
