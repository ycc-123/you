卷 软件 的文件夹 PATH 列表
卷序列号为 0000004F 0001:7E25
D:.
│  .env
│  .eslintrc
│  .gitignore
│  package-lock.json
│  package.json
│  README.md
│  
├─.idea
│  │  deployment.xml
│  │  modules.xml
│  │  post.iml
│  │  webServers.xml
│  │  workspace.xml
│  │  
│  └─inspectionProfiles
├─build
│  │  asset-manifest.json
│  │  favicon.ico
│  │  iconfont.css
│  │  index.css
│  │  index.html
│  │  manifest.json
│  │  service-worker.js
│  │  
│  └─static
│      ├─css
│      │      main.9cfc0707.css
│      │      main.9cfc0707.css.map
│      │      
│      └─js
│              charts.06e52441.js
│              charts.06e52441.js.map
│              main.db1f73a0.js
│              main.db1f73a0.js.map
│              vendor.96a0ea18.js
│              vendor.96a0ea18.js.map
│              
├─config
│  │  env.js
│  │  paths.js
│  │  polyfills.js
│  │  vendor.config.js
│  │  webpack.config.dev.js
│  │  webpack.config.prod.js
│  │  webpackDevServer.config.js
│  │  
│  └─jest
│          cssTransform.js
│          fileTransform.js
│          
├─public
│      favicon.ico
│      iconfont.css
│      index.css
│      index.html
│      manifest.json
│      
├─scripts
│      build.js
│      start.js
│      test.js
│      
├─src
│  │  api.js
│  │  App.js
│  │  index.js
│  │  registerServiceWorker.js
│  │  router.js
│  │  
│  ├─action
│  │      index.js
│  │      type.js
│  │      
│  ├─assets
│  │  └─less
│  │          common.less
│  │          var.less
│  │          
│  ├─axios
│  │      index.js
│  │      
│  ├─components
│  │  ├─BreadcrumbCustom
│  │  │      index.jsx
│  │  │      
│  │  ├─CenterCustom
│  │  │  │  index.jsx
│  │  │  │  index.less
│  │  │  │  
│  │  │  └─GoodsCell
│  │  │          index.jsx
│  │  │          index.less
│  │  │          
│  │  ├─FooterCustom
│  │  │  │  index.jsx
│  │  │  │  index.less
│  │  │  │  
│  │  │  └─FooterMenuItem
│  │  │          index.jsx
│  │  │          
│  │  ├─HeaderCustom
│  │  │      index.jsx
│  │  │      index.less
│  │  │      
│  │  ├─pages
│  │  │      Login.jsx
│  │  │      NotFound.jsx
│  │  │      
│  │  ├─Search
│  │  │      index.jsx
│  │  │      
│  │  ├─SiderCustom
│  │  │      index.jsx
│  │  │      index.less
│  │  │      SiderMenu.jsx
│  │  │      
│  │  └─SiderRightCustom
│  │      │  index.jsx
│  │      │  index.less
│  │      │  
│  │      ├─SiderRightBody
│  │      │      index.jsx
│  │      │      
│  │      ├─SiderRightFooter
│  │      │      index.jsx
│  │      │      
│  │      └─SiderRightHeader
│  │              index.jsx
│  │              
│  ├─constants
│  │      menus.js
│  │      
│  ├─reducer
│  │      category.js
│  │      index.js
│  │      
│  ├─routes
│  │      index.js
│  │      
│  ├─style
│  │  │  banner.less
│  │  │  button.less
│  │  │  card.less
│  │  │  global.less
│  │  │  icons.less
│  │  │  img.less
│  │  │  index.less
│  │  │  login.less
│  │  │  menu.less
│  │  │  modal.less
│  │  │  scroll.less
│  │  │  table.less
│  │  │  utils-border.less
│  │  │  utils-color.less
│  │  │  utils-size.less
│  │  │  utils-spacing.less
│  │  │  utils-text.less
│  │  │  variables.less
│  │  │  
│  │  ├─imgs
│  │  │      404.png
│  │  │      avatar.jpg
│  │  │      b1.jpg
│  │  │      header_logo.jpg
│  │  │      logo.png
│  │  │      
│  │  ├─lib
│  │  │      animate.css
│  │  │      
│  │  └─theme
│  │          index.js
│  │          theme-danger.json
│  │          theme-grey.json
│  │          theme-info.json
│  │          theme-warn.json
│  │          
│  └─utils
│          index.jsx
│          
└─theme
        index.json
        





  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uniacid` int(11) NOT NULL,
  `salerid` varchar(200) NOT NULL,
  `orderid` varchar(600) NOT NULL,
  `num` int(11) NOT NULL,
  `posprice` varchar(100) NOT NULL,
  `discount_num` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
  `discount_fee` decimal(10,2) NOT NULL COMMENT '优惠金额',
  `is_memberprice` tinyint(3) NOT NULL DEFAULT '0' COMMENT '会员价',
  `commissiontype` tinyint(3) NOT NULL DEFAULT '0' COMMENT '佣金计算方式',
  `commission` varchar(255) NOT NULL,
  `is_score` tinyint(3) NOT NULL DEFAULT '0' COMMENT '该订单是否有积分 0没有 1有',
  `score` int(11) NOT NULL DEFAULT '0' COMMENT '积分',
  `barcode` varchar(50) NOT NULL COMMENT '商品条码',
  `unit` int(11) NOT NULL COMMENT '单位id',
  `unitname` varchar(100) NOT NULL COMMENT '单位名称',
  `returntype` int(11) NOT NULL DEFAULT '0' COMMENT '退货 0无1是',
  `refund_price` decimal(10,2) NOT NULL,




  `gnum` int(11) NOT NULL COMMENT '0',
  `memberid` varchar(1000) NOT NULL COMMENT '用户名',
  `status` int(2) NOT NULL COMMENT '0待付款 1已付款 4全部退款  6部分退款  9 已取消',
  `addressid` int(11) NOT NULL COMMENT '地址id',
  `pay_type` int(4) NOT NULL COMMENT '支付方式1：支付宝2:微信支付，3现金，4银行卡 9:会员支付，0:虚拟人',
  `remark` varchar(100) NOT NULL DEFAULT '' COMMENT '买家留言',
  `goodsprice` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '商品总价格',
  `pay_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '实付金额',
  `discount_num` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '折扣',
  `returntype` int(11) NOT NULL DEFAULT '0' COMMENT '退货 0无1是',
  `discount_fee` decimal(10,2) NOT NULL COMMENT '减免',
  `use_score` int(11) NOT NULL DEFAULT '0' COMMENT '使用积分数',
  `score_discount` int(11) NOT NULL DEFAULT '0' COMMENT '积分优惠',
  `wechat_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '微信折扣(100默认是没有折扣)',
  `member_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '余额折扣(100默认是没有折扣)',
  `huiyuan_discount` float(10,2) NOT NULL DEFAULT '100.00' COMMENT '会员折扣',
  `refund_price` dec
  `toye` tinyint(3) NOT NULL DEFAULT '0' COMMENT '现金转余额(0不开启1开启)',
  `print_xp` tinyint(3) NOT NULL DEFAULT '0' COMMENT '订单结算后打印小票（0不打印1打印）',




‣桳畯楹橮੩