新版降AIGC
老版的降AIGC是按次数收费的，部分用户可能存在未使用完的次数。
1.新旧版本需要暂时并行，旧版本停止维护，在新版本上线运行一个月之后对旧版本进行彻底下线
2.降AIGC页面右上角的购买次数需要去掉
3.进入降AIGC页面弹出的购买窗口也需要去掉
4.加入一个切换按钮，类似下面这种样式
a.进入降AIGC页面默认展示新版本，显示“旧版”的切换
b.在新版本的降AIGC页面需要显示“旧版”的切换


1. 页面设计
1.1 页面弹窗
进入新版本降AIGC页面的时候，增加一个如下的弹窗，文案内容修改为
Plain Text
重要提示（红字加粗）
请注意（黑字加粗）：
不同平台的AI检测算法各不相同，检测结果之间没有参考价值
知网维普格子达查重100%一次过
paperpass的AI查重逻辑和主流的付费的AI查重如知网维普格子达不一致，若选择知网维普则无法通过paperpass的检测


1.2 降AIGC主页面
1.COPY写作狗官网的页面即可：https://www.xiezuodog.com/home
2.不支持英文，英文相关的页面可以不开发，因为写作狗的英文支持有问题。
3.页面展示的信息调用/api/ai-paper/aigc/info接口获取
4.上传文件仅限单个上传，仅支持docx格式
5.用户输入文本  或者 上传文件之后，调用获取预估价格接口，给用户展示预期价格
6.注意：用户的输入方式这里，前边加一个“输入方式”，风格和“文本语言”、“检测类型”统一


2. 支付逻辑
•进入页面 -->  用户余额 -->  用户输入  -->  获取预估价格  -->  点击生成  -->  弹窗提醒  -->  用户选择余额支付/直接付款
￮直接付款  -->  付款二维码  -->  轮询订单状态  -->  订单支付成功   -->  轮询查询执行结果接口获取处理结果
￮余额支付  -->  轮询查询执行结果接口获取处理结果
3. 接口
3.1 获取产品信息接口
3.1.1 业务逻辑
1.该接口返回所有产品信息，包含产品名称、描述、定价等内容，前端需要基于该接口的返参进行展示；
2.返参格式参见响应示例
3.返参字段说明：
a.product：产品定义，用户进行降重、降AIGC等操作时需要传给后端
b.product_name：产品名称，用于前端展示
c.description：产品描述，用于前端展示
d.price：产品单价（单位：元），与unit字段关联使用，比如unit为1000，表示3元/1000字
e.support_language：支持的文本语言
i.language：用于传递给后端
ii.description：用于前端展示
f.cn_support_platform：支持的检测平台，如果该字段为空或空数组，则前端不展示 检测平台
i.platform：用于传递给后端
ii.description：用于前端展示
g.support_input_type：支持的输入方式
i.input_type：用于传递给后端
ii.description：用于前端展示
3.1.2 接口地址
GET /api/ai-paper/aigc/product
3.1.3 请求参数
无，该接口请求头无需Token
3.1.4 响应示例
响应示例：
JSON
{
    "code": 200,
    "message": "success",
    "result": [
        {
            "product": "deduplication",
            "product_name": "深度降重",
            "description": "全网领先的降重技术，一键大幅度降低重复率，保证学术表达",
            "price": 3,
            "unit": 1000,
            "support_language": [
                {
                    "language": "CN",
                    "description": "中文"
                }
            ],
            "cn_support_platform": [],
            "support_input_type": [
                {
                    "input_type": "text",
                    "description": "文本输入"
                },
                {
                    "input_type": "file",
                    "description": "文件上传(请上传需要处理的段落)"
                }
            ]
        },
        {
            "product": "aigc",
            "product_name": "降AIGC",
            "description": "优化文本内容，降低AI生成痕迹，使文章更具人文特色",
            "price": 3,
            "unit": 1000,
            "support_language": [
                {
                    "language": "CN",
                    "description": "中文"
                }
            ],
            "cn_support_platform": [
                {
                    "platform": "cnki",
                    "description": "知网/维普"
                },
                {
                    "platform": "gzd",
                    "description": "格子达"
                },
                {
                    "platform": "paperyy",
                    "description": "paperyy"
                },
                {
                    "platform": "paperpass",
                    "description": "paperpass"
                },
                {
                    "platform": "bgw",
                    "description": "笔杆网"
                },
                {
                    "platform": "daya",
                    "description": "大雅"
                },
                {
                    "platform": "wanfang",
                    "description": "万方"
                },
                {
                    "platform": "zhuque",
                    "description": "朱雀"
                },
                {
                    "platform": "huachen",
                    "description": "华宸"
                }
            ],
            "support_input_type": [
                {
                    "input_type": "text",
                    "description": "文本输入"
                },
                {
                    "input_type": "file",
                    "description": "文件上传(请上传需要处理的段落)"
                }
            ]
        },
        {
            "product": "combined",
            "product_name": "降重+降AIGC",
            "description": "同时降低重复率和AI生成痕迹，全面提升文章质量",
            "price": 5,
            "unit": 1000,
            "support_language": [
                {
                    "language": "CN",
                    "description": "中文"
                }
            ],
            "cn_support_platform": [
                {
                    "platform": "cnki",
                    "description": "知网/维普"
                },
                {
                    "platform": "gzd",
                    "description": "格子达"
                },
                {
                    "platform": "paperyy",
                    "description": "paperyy"
                },
                {
                    "platform": "paperpass",
                    "description": "paperpass"
                },
                {
                    "platform": "bgw",
                    "description": "笔杆网"
                },
                {
                    "platform": "daya",
                    "description": "大雅"
                },
                {
                    "platform": "wanfang",
                    "description": "万方"
                },
                {
                    "platform": "zhuque",
                    "description": "朱雀"
                },
                {
                    "platform": "huachen",
                    "description": "华宸"
                }
            ],
            "support_input_type": [
                {
                    "input_type": "text",
                    "description": "文本输入"
                },
                {
                    "input_type": "file",
                    "description": "文件上传(请上传需要处理的段落)"
                }
            ]
        },
        {
            "product": "combinedplus",
            "product_name": "高智版降重降AI",
            "description": "保证学术性表达，效果媲美人工降重，重复率AI率一次直接达标",
            "price": 8,
            "unit": 1000,
            "support_language": [
                {
                    "language": "CN",
                    "description": "中文"
                }
            ],
            "cn_support_platform": [
                {
                    "platform": "cnki",
                    "description": "知网/维普"
                }
            ],
            "support_input_type": [
                {
                    "input_type": "text",
                    "description": "文本输入"
                },
                {
                    "input_type": "file",
                    "description": "文件上传(请上传需要处理的段落)"
                }
            ]
        }
    ]
}



3.2 获取预估价格
3.2.1 业务逻辑
1.用户输入内容  或者  上传文件之后，前端需要调用接口，获取到预估价格在前端进行展示
3.2.2 接口地址
POST /api/ai-paper/aigc/predict_price
3.2.3 请求参数（form-data）
字段	类型	必填	说明
product
	string	是	用户勾选选择的产品
language	string	否	默认CN
input_type	string	是
	用户的输入方式：
text-文本
file-文件
input_text	string	否	用户输入方式为text时必传
file	file	否	用户输入方式为file时必传
3.2.4 响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "predict_price": 3,
        "total_chars": 557
    }
}



3.3 付款+异步文本处理
3.3.1 业务逻辑
1.用户输入文本或上传文件
2.前端展示预估价格，并基于用户余额做个校验提示用户余额是否充足
3.用户点击一键生成 
a.用户余额充足，让用户作二次确认，然后调用接口，接口会返回task_id，基于task_id调用/api/ai-paper/aigc/result获取降重结果
b.用户余额不足，让用户充值余额
3.3.2 接口地址
POST /api/ai-paper/aigc/reduce
3.3.3 请求参数（form-data）
字段	类型	必填	说明
product
	string	是	用户勾选选择的产品
language	string	否	默认CN
platform	string	是	用户勾选的检测平台
说明：深度降重没有检测平台，无需该字段
input_type	string
	是
	用户的输入方式：
text-文本
file-文件
input_text	string	否	用户输入方式为text时必传
file	file	否	用户输入方式为file时必传
3.3.4 响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "task_id": "oV3RnMXwm3"
    }
}

3.4 充值余额
3.4.1 业务逻辑
1.不提供直接付款后处理，降AIGC走余额
2.余额不足则提示用户充值余额
3.4.2 接口地址
GET /api/ai-paper/aigc/recharge
3.4.3 请求参数（Query）
字段	类型	必填	说明
recharge_amount	string	是	用户充值的金额
3.4.4 响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "out_trade_no": "2e134d8f-d546-488c-9d50-c720619f52b2",  // 订单号
        "pay_amount": 50, // 充值金额
        "pay_link": "https://openapi.alipay.com/gateway.do?app_id=2021004165663603&biz_content=%7B%22out_trade_no%22%3A%222e134d8f-d546-488c-9d50-c720619f52b2%22%2C%22product_code%22%3A%22FAST_INSTANT_TRADE_PAY%22%2C%22qr_pay_mode%22%3A4%2C%22subject%22%3A%22%E6%B5%85%E6%80%9D%E7%A7%91%E6%8A%80%22%2C%22total_amount%22%3A%220.01%22%7D&charset=utf-8&format=JSON&method=alipay.trade.page.pay&notify_url=https%3A%2F%2Fdevapi.mixpaper.cn%2Fapi%2Fai-paper%2Fnotify%2Falipay&return_url=https%3A%2F%2Fmixpaper.cn%2F%23%2Fdashboard&sign=FWLb88Cl6UtWFpwRVmyybrBIK3SDfZ%2F7mu0snHztV4%2BSjPTMakJIPZMjk08Y4VS%2BEXQfgc%2FTN%2B9yQBbwlx9gG%2Fb%2BxGcrdZzZ63cRTh6Xs60dCGXVihSecI%2B1SUhESCOHwXllFQ0%2FlccpVbSDvmmbnrn1RYcwsM7EhsoUD%2Bv%2BILfcOV4AOAqife2%2BnG0k0wJv8hNAY1NYrD6oi5Oj9kYm6IXJcWko96j0F1WiIxCNZO6xiD%2FlyzcbaLLFn9u1X7jwIH2DRr2pyrTYWqYfniVK%2BvrBKwYHLYem0ezMiJyO1fR%2Bc%2FpzJe2h%2Byxx0OUmbfEaH%2FzP9Zwl3Qkk6Wtwf%2F0G2g%3D%3D&sign_type=RSA2&timestamp=2025-10-10+18%3A22%3A19&version=1.0",
        "payment_method": "alipay"
    }
}


3.5 查询用户降AIGC可用余额
3.5.1 业务逻辑
1.用户进入降AIGC页面，获取用户降AIGC的可用余额
2.用户充值余额 或  进行降重操作之后需要调用该接口刷新可用余额
3.用户输入文本 或者 上传文件之后，在获取预估价格之后需要调用该接口获取用户最新的降AIGC可用余额
3.5.2 接口地址
GET /api/ai-paper/aigc/balance
3.5.3 请求参数（Query）
无，请求头带Token即可
3.5.4 响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "balance": "0"
    }
}



3.6 查询降重结果
3.6.1 业务逻辑
1.用户在执行降AIGC之后，接口会返回一个任务Id，前端拿到这个任务Id轮询当前接口
3.6.2 接口地址
GET /api/ai-paper/aigc/result
3.6.3 请求参数（Query）
字段	类型	必填	说明
task_id
	string	是	订单编号
3.6.4 响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "task_status": 0, // 0-处理中，1-完成，2-失败
        "result_text": "测试结果", // 测试结果
    }
}



3.7 分页查询用户的降重记录
3.7.1 接口地址
GET /api/ai-paper/aigc/records
3.7.2 请求参数（Query）
字段	类型	必填	说明
page_num
	Integer
	否	页数，不传默认为1
page_size	Integer	是	每页记录数，不传默认为10
3.7.3 响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "page_num": "1",
        "page_size": "5",
        "total": 1,
        "record_list": [
            {
                "id": 1,
                "user_id": 22,  
                "task_id": "12312321", // 任务Id
                "original_text": "测试输入", // 输入内容
                "result_text": "测试结果", // 输出内容
                "status": 0, // 状态
                "created_time": "2025-09-30T17:56:12+08:00", // 创建时间
                "updated_time": "2025-09-30T17:56:12+08:00" // 更新时间
            }
        ]
    }
}
