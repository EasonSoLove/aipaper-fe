优惠券功能改造
1. 优惠券背包

1.1 业务逻辑
1.展示用户未使用的优惠券
2.展示用户已使用的优惠券
3.展示用户已失效的优惠券：过期一个月以内的优惠券，过期一个月以上的优惠券不予展示
4.优惠券查询不分页
1.2 接口地址
GET /api/ai-paper/coupon/bag
1.3 请求参数（无）
无需额外传参
1.4 响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "available_coupon_list": [   // 未使用
            {
                "type": 1, // 1-折扣券，3-降AIGC次数券
                "coupon_code": "c05cce652e1574e5d5cfcbc102f408b7", // 优惠券代码-前端可以不展示
                "discount_rate": 0.3,// type = 1时，该字段为折扣系数，0.9代表9折，0.0代表免费
                "rights_num": 0, // type = 3时，该字段为降AIGC的次数
                "expire_time": "2025-08-30T00:00:00+08:00",// 过期时间
                "status": 6,// 状态前端可以不展示: 1-未使用，2-已使用，3-已过期，4-冻结，5-作废，6-已兑换
                "limit_tips": "仅限生成 [毕业论文] 使用，以下学业类型不可用：结课论文、开题报告、任务书、文献综述" // 备注信息：需要展示
            }
        ],
        "used_coupon_list": [   // 已使用
            {
                "type": 1,
                "coupon_code": "MIXPAPER90OFF2025",
                "discount_rate": 0.9,
                "rights_num": 0,
                "expire_time": "2099-01-01T00:00:00+08:00",
                "status": 2,
                "limit_tips": "仅限生成 [毕业论文] 使用，以下学业类型不可用：结课论文、开题报告、任务书、文献综述"
            },
            {
                "type": 3,
                "coupon_code": "8c2f0da6f9dc3550e30018f224a7ece4",
                "discount_rate": 0,
                "rights_num": 10,
                "expire_time": "2025-12-30T12:00:00+08:00",
                "status": 2,
                "limit_tips": "降AIGC次数券兑换后自动使用"
            },
            {
                "type": 3,
                "coupon_code": "6aa6377f0bd3c360c81b39a85e92cbfd",
                "discount_rate": 0,
                "rights_num": 10,
                "expire_time": "2025-12-30T12:00:00+08:00",
                "status": 2,
                "limit_tips": "降AIGC次数券兑换后自动使用"
            }
        ],
        "expired_coupon_list": null   // 已失效
    }
}



2. 兑换优惠券
2.1 业务逻辑
1.接口为已有接口，后端需要支持所有优惠券的兑换，前端需要调整页面
2.用户输入优惠券代码，兑换优惠券
3.降AIGC券会帮用户自动兑换成降AIGC次数，然后标记为“已使用”
4.折扣券会放入用户优惠券背包，前端需要在用户兑换之后调用GET /api/ai-paper/coupon/bag刷新用户的优惠券
2.2 接口地址
GET /api/ai-paper/coupon/exchange_coupon
2.3 请求参数（Query）
字段	类型	必填	说明
coupon_code
	String	是	用户输入的优惠券代码
2.4 成功响应示例
JSON
{
    "code": 200,
    "message": "优惠券兑换成功！",
    "result": null
}
2.5 失败响应示例
JSON
{
    "code": 40017,
    "message": "优惠券无效或已被使用",
    "result": null
}



3. 正文订单修改（自动匹配最合适的优惠券）
3.1 业务逻辑
1.修改已有接口，在生成订单时，后端会自动查找用户可用的优惠券，然后返给前端一个当前订单可用的优惠券列表
2.优惠券列表的第一个优惠券一定是最优的，后端会默认选中
3.如果用户选择其他优惠券，则以用户选中的为准，前端需要将用户指定的优惠券传给后端
4.用户在30元购买的免费生成也会以免费优惠券的形式使用，只不过会限制同一个大纲
5.用户在这个界面用免费生成券，也需要支付，会支付0.01元
3.2 接口地址
POST /api/ai-paper/orders/order
3.3 请求参数（JSON）
JSON
{
    "user_id": 1,
    "is_reduce_aigc": true,
    "payment_method": "alipay",
    "total_amount": 89,
    "pay_type": "PAY_ALL",
    "key": "77b15082-ba8f-450b-a79a-5ab0635e8b21",
    "product": "毕业论文",
    "type": "本科",
    "word_count": 12000,
    "coupon_code": "", // 优惠券代码
    "items": [
        {
            "product_id": "1",
            "quantity": 1,
            "price": 149.85
        },
        {
            "product_id": "61",
            "quantity": 1,
            "price": 30
        },
        {
            "product_id": "62",
            "quantity": 1,
            "price": 20
        }
    ]
}
3.4 成功响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "pay_link": "https://openapi.alipay.com/gateway.do?app_id=2021004165663603&biz_content=%7B%22out_trade_no%22%3A%22f4cfa3d3-b1cd-4e93-b0e5-0fa09eefabbc%22%2C%22product_code%22%3A%22FAST_INSTANT_TRADE_PAY%22%2C%22qr_pay_mode%22%3A4%2C%22subject%22%3A%22%E6%B5%85%E6%80%9D%E7%A7%91%E6%8A%80%22%2C%22total_amount%22%3A%220.01%22%7D&charset=utf-8&format=JSON&method=alipay.trade.page.pay&notify_url=https%3A%2F%2Fdevapi.mixpaper.cn%2Fapi%2Fai-paper%2Fnotify%2Falipay&return_url=https%3A%2F%2Fmixpaper.cn%2F%23%2Fdashboard&sign=LbDqM%2FlklOHFfFuy8%2FjSfcXxJPAF2MhoMq6yd6vHwGfn8FwdYwlLM0T10ikA4AqGXSUM%2BM20fh2Hyuary1IcHuZHt5GR1YkYFIGVwGrfMU9cUEVro3C%2BzfwBcXurQWnGKzmjysMqv6RHjnhHdRowssZoUSp9CgxG7Ck0MmrKTrUE%2FkeTj%2FT2p9zXHPVbxCaiXbptcLO77g2kKPG8nhF4I9Fz8108uDCWfoyLPumbAsJDkJl%2FmrhhreUAUlVlcfCsDW2TW1yvi4U%2Ba3LmLCEyXw24wxw%2Bdiec1ND4yK5BlVJaqBwBdIlGsHi%2Fu2k4jLoeQHaSzgpQfPz09qEs4%2BEYYA%3D%3D&sign_type=RSA2&timestamp=2025-08-28+18%3A18%3A20&version=1.0",
        "pay_amount": 55.8,
        "original_amount": 186,
        "discounted_price": 130.2,
        "out_trade_no": "f4cfa3d3-b1cd-4e93-b0e5-0fa09eefabbc",
        "word_count": 12000,
        "is_reduce_aigc": false,
        "order_type": "PAPER_UNDERGRADUATE",
        "available_coupons": [ // 可用的优惠券列表
            {
                "coupon_code": "c05cce652e1574e5d5cfcbc102f408b7",
                "discount_rate": 0.3,
                "is_selected": false
            },
            {
                "coupon_code": "other_196eef5f-d5ca-4daf-a55e-fd402f7af7b3",
                "discount_rate": 0.9,
                "is_selected": true
            },
            {
                "coupon_code": "other_b9916e33-66bb-4acc-a5f5-34cda1eaafd4",
                "discount_rate": 0.9,
                "is_selected": false
            }
        ]
    }
}



4. 尾款订单修改（和正文订单逻辑一致）
4.1 业务逻辑
1.修改已有接口，在生成订单时，后端会自动查找用户可用的优惠券，然后返给前端一个当前订单可用的优惠券列表
2.优惠券列表的第一个优惠券一定是最优的，后端会默认选中
3.如果用户选择其他优惠券，则以用户选中的为准，前端需要将用户指定的优惠券传给后端
4.2 接口地址
POST /api/ai-paper/orders/balance_pay
4.3 请求参数（JSON）
JSON
{
    "out_trade_no": "ae1bc793-05aa-4ba4-9b8d-560141e0f3f2",
    "payment_method": "alipay",
    "coupon_code" : ""
}
4.4 成功响应示例
JSON
{
    "code": 200,
    "message": "success",
    "result": {
        "pay_link": "https://openapi.alipay.com/gateway.do?app_id=2021004165663603&biz_content=%7B%22out_trade_no%22%3A%228a155df1-b700-411c-8e1a-8e4521452a9d%22%2C%22product_code%22%3A%22FAST_INSTANT_TRADE_PAY%22%2C%22qr_pay_mode%22%3A4%2C%22subject%22%3A%22%E6%B5%85%E6%80%9D%E7%A7%91%E6%8A%80%22%2C%22total_amount%22%3A%220.01%22%7D&charset=utf-8&format=JSON&method=alipay.trade.page.pay&notify_url=https%3A%2F%2Fdevapi.mixpaper.cn%2Fapi%2Fai-paper%2Fnotify%2Falipay&return_url=https%3A%2F%2Fmixpaper.cn%2F%23%2Fdashboard&sign=nC5HpRfgUOTIemz8w%2BuK45NGcaoU26TBYH08%2BNVKKvk8M8XnC3qqgt6X%2B3wRx20s4mftvmZUs2NXeMUa23OBMT8iScmUZxKMZsZglUci0NX6rZjrXDZH3hy1KfYNNEHDhLdt2Cel4utGf158bE4TtPHREp7g1Q4Fams0V8Z8os9lkOZwfGt4Rec8XPw7Ncd5wa6v57lhKgtAHJhSIbgKsnRnf9d52FMc0BnoS7ujmi6iTeom5buszyfIUsHG9EfRc2zhVKS94i%2BRBfqw4aP5h8Q46wVCVINuhXYCH4Xn4fBwgUesalCcACt8DJyFwsX4dyD%2BA54on9fK%2BLHENvYcdw%3D%3D&sign_type=RSA2&timestamp=2025-08-28+18%3A46%3A15&version=1.0",
        "pay_amount": 147.4,
        "original_amount": 166,
        "discounted_price": 18.6,
        "out_trade_no": "ae1bc793-05aa-4ba4-9b8d-560141e0f3f2",
        "word_count": 10000,
        "is_reduce_aigc": false,
        "order_type": "PAPER_UNDERGRADUATE_STAGES",
        "available_coupons": [
            {
                "coupon_code": "c05cce652e1574e5d5cfcbc102f408b7",
                "discount_rate": 0.3,
                "is_selected": false
            },
            {
                "coupon_code": "other_196eef5f-d5ca-4daf-a55e-fd402f7af7b3",
                "discount_rate": 0.9,
                "is_selected": true
            },
            {
                "coupon_code": "other_b9916e33-66bb-4acc-a5f5-34cda1eaafd4",
                "discount_rate": 0.9,
                "is_selected": false
            }
        ]
    }
}
4.5 失败响应示例
JSON





5. 全款订单支付回调修改（仅后端）
1.用户勾选了免费生成1次  或  降AIGC100次，需要正确处理


6. 退款修改（仅后端）
1.退款时需要正确处理用户的钱
2.退完之后需要处理用户的权益，买的免费券券需要置为失效，买的降AIGC次数需要扣减掉


7. 大纲列表修改（仅前端）
前端需要在大纲列表展示每个大纲的key，目前接口是有返回的
