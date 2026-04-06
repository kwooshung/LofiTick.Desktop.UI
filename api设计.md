# 基本说明
- I:\Desktops\LofiTickDesktop
- I:\Backends\Rust\LofiTick.API
- I:\Frontends\LofiTick.Desktop.UI
- I:\Desktops\LofiTick.Desktop

这三个文件夹，我今后就称作 api nuxt 和 tauri 或者与之对应的了，我后面将给你提一些需求，你来帮助我实现。

# 基本说明
首先，我要实现的是一个url签名的功能，因为只要涉及到前端签名相关的东西，就得暴露给前端，所以100%隐藏是不可能的，我们要做的是提高门槛，让普通人无法轻易破解。而且就算被破解了，也只能合法访问到 api 的接口，就像普通网站做的那样的公开接口一样，就算废了九牛二虎之力破解了签名算法，也只能访问到公开接口，无法访问到其他接口。因为这是url签名，又不是登录用的jwt。

首先，我给你看下我的老的设计，I:\Desktops\LofiTick.Desktop，这个目录，老的设计是3个项目集成到一起的，主要是 nuxt4 实现的，我们现在拆分成了三个项目。

首先我的nuxt项目必须开启ssr的，因为今后可能网页也会用到这个接口和这个nuxt项目，所以必须开启ssr的，你看我老的设计的 I:\Desktops\LofiTickDesktop\frontend\app\composables\hooks\useApi\index.ts 这个文件，主要是用来请求接口的，自动做了很多安全方面的设计。而且非常兼容ssr。

因此新的项目，I:\Frontends\LofiTick.Desktop.UI\app\composables\hooks\useApi\index.ts 也必须完全支持ssr的，而且用的是 Nuxt5，别跟我说什么 Nuxt5 还没发布什么的，我知道，因为 https://nuxt.com/docs/5.x/getting-started/upgrade 这个文档已经发布了，所以我们完全可以用 Nuxt5 来开发了，不是说必须等待 Nuxt5 正式发布了才能开发，而是说我们现在就可以用 Nuxt5 来开发了，这样才能等到 Nuxt5 正式发布了，我们的项目也已经开发好了，甚至可能已经上线了。

# 逻辑说明
api 需要提供两个接口，一个是 init，另一个是 refresh；

## AES Key 的计算方法
- 设计一个 AES Key 的计算方法，这个 AES Key 是用来加密这些敏感数据的，前端js在生成签名的时候，需要用这个 AES Key 来解密签名字符串的；这样前端保留着这个算法，后端也有这个算法，这样解密的时候就比较安全了，至少不是明文的签名字符串了，而且生成的这个 key 在一段时间内，是一样的，过了这个时间就变了，因为如果每次都不一样，那前端就没法用了，解不开了，至于说的一段时间是这样的；
- 当然还有个问题，如果后端加密的时候，刚好一个key，到了前端计算出来的是另外一个，就是说刚好在过渡期生成的，怎么办？是不是应该也设计一个过渡期的窗口期，可以兼容老的key？过渡期过了，老的key就废了，前端也不需要兼容了，这样就比较合理了；

## init 接口
- 永远都得在 nuxt 的 server 端来调用；
- 这个接口主要是用来初始化签名的，前端在第一次访问的时候，页面还没有打开的时候，由 Nuxt 的 server 端来访问这个接口，获取到签名的相关信息，api 端口获取到后，会读取：I:\Backends\Rust\LofiTick.API\.env 文件中的以下字段，当然 rust 端已经有工具实现了读取：
SECURITY_SIGN_MASTER_KEY
SECURITY_SIGN_TTL_SEC
SECURITY_SIGN_CLOCK_SKEW_MS
SECURITY_SIGN_HEADER_NAME
SECURITY_SIGN_HEADER_SIG_PREFIX
SECURITY_CSRF_COOKIE_NAME
SECURITY_CSRF_HEADER_NAME

## refresh 接口
同样是这个 AES Key 的计算方法，它主要包含了密钥相关的东西
SECURITY_SIGN_TTL_SEC
SECURITY_SIGN_CLOCK_SKEW_MS
SECURITY_SIGN_HEADER_NAME
SECURITY_SIGN_HEADER_SIG_PREFIX

> 前端解密说明：Nuxt 前端需要一个公开的 AES seed（对应后端 SECURITY_SIGN_AES_SEED），请通过 `NUXT_PUBLIC_SIGN_AES_SEED` 注入到 runtimeConfig.public（用于解密 `attach.sign_refresh` 写入 cookie 的 blob）。

## init/refresh 接口通用说明
- api 端口只验证 apptype，其他签名，csrf 相关的内容，都不需要，否则会导致死循环；
- 我列举的那些字段，只是示例，是告诉你有哪些内容，千万别照抄，你要设计一个非常合理的json结构来返回这些内容的，可以存在其他的字段；


## 签名密钥计算
你需要先做一个rust 的 server 服务，然后实现密钥计算，有以下特点：
- 计算签名密钥，至于计算方法，你可以自己设计一个算法，注意，我说的是密钥算法，不是签名，是签名的密钥算法，用来给前端js生成签名用的密钥字符串，它是有时间限制的；
- 第一次访问页面，就是用户在浏览器中输入地址打开服务器响应网页前，Nuxt Server 端，肯定得访问服务器的，因为 useApi 中，只要缺少签名相关的内容，无论请求什么接口，都得在 useApi 中先排队，等待获取到 init/refresh 接口的响应内容，拿到这些内容后，才会继续请求接口的，否则就算请求接口了，也无法通过验证。

### 什么是一段时间
SECURITY_SIGN_TTL_SEC=600
SECURITY_SIGN_CLOCK_SKEW_MS=30000
- 这个意思是说，生成的签名密钥的有效期是10分钟，也就是600秒，前端在生成签名的时候，如果当前时间和服务器时间相差超过了30秒（30000毫秒），所以一共是630秒的有效期，过了这个时间，前端就需要重新调用 refresh 接口来获取新的签名密钥了。
- 为什么是refresh接口呢？因为这个接口是用来刷新签名密钥的，init包含了很多固定死的设计，因此只需要获取一次就好了，后续只需要调用 refresh 接口来刷新签名密钥就好了。当然这两个接口，永远都得在 nuxt 的 server 端来调用，前端 js 是无法直接调用这两个接口的；

### 有哪些刷新方式和时机呢？
- 首先，分三种情况：
1. 用户第一次访问页面，页面还没有打开，这个时候，nuxt 的 server 端会访问 init 接口来获取这些内容的；
2. 当发起请求的时候，发现时效刚好过了 SECURITY_SIGN_TTL_SEC 秒，但还没有过 SECURITY_SIGN_TTL_SEC + SECURITY_SIGN_CLOCK_SKEW_MS 秒，服务器接收到了，发现快过期了但是还没完全过期，这个时候，请求的任何接口，都会被统一强制给json增加一个字段，里面包含了本应该刷新接口所提供的所有字段内容，当然也得是 AES Key 的加密方式；
3. 用户在页面打开后，过了一段时间，签名密钥过期了（SECURITY_SIGN_TTL_SEC + SECURITY_SIGN_CLOCK_SKEW_MS），这个时候，前端 js 就需要调用 refresh 接口来获取新的签名密钥了，刷完之后，才会请求接口的；

> 但是现在有个边界问题，我还不知道怎么办，如果前端请求的时候，符合 条件2 的情况，但是到了服务器再次验证条件所属的时候，发现变成了条件3了，这个时候，服务器应该怎么处理呢？我希望静默处理这些，但是如果是只要是过期 SECURITY_SIGN_TTL_SEC 秒了，无论什么时候都直接返回新的密钥，条件3的意义就没了。
> 我的想法是，当服务器端因为从 条件2 变成 条件3 的情况，我认为就得拒绝，然后前端发现拒绝后，直接进入条件3重试一次就行了吧？

### 那么前端怎么获取到这些需要的内容呢？
- 条件 1 或者 2，nuxt server 代理后接到 api 加密的数据，永远不会直接把加密的内容，直接返回给前端。它会先把内容原封不动的放到 cookie 里面，同时改写json，删除对应刷新的字段，再返回。然后前端 useApi 只要发现是 init 接口的响应，或者计算出来服务器快到期了（这是请求前计算到的结果，绝对不能是请求后计算的结果，因为状态条件可能不一样了），就会从 cookie 里面获取到这个加密的内容，然后用 AES Key 来解密这个内容，然后缓存起来，同时删除对应的 cookie；或者也可以无论什么情况，接收到回传的数据，先尝试读取cookie，只要读取到了，就解密，然后就会这个cookie值，保证万无一失。
- 条件 3，既然已经完全过期了，还是直接刷新呗，然后还是放到 cookie 里面，前端拿到响应后，直接从 cookie 里面获取到这个加密的内容，然后用 AES Key 来解密这个内容，然后缓存起来，同时删除对应的 cookie；然后拿着新的签名密钥，继续请求接口的；

#### api 端口的设计
GET /security/sign/init
GET /security/sign/refresh

#### csrf 相关的设计
- 我打算 api 和 nuxt 都要验证 csrf 的，因为他们两个，csrf 的实现和方案都不一样的，cookie会记录两个的，一个给 api 的，一个给 nuxt 的；

# 一定要注意
好好分析我给你的这四个项目目录：

- I:\Desktops\LofiTickDesktop
- I:\Backends\Rust\LofiTick.API
- I:\Frontends\LofiTick.Desktop.UI
- I:\Desktops\LofiTick.Desktop

这三个项目目录，分别是后端 api 项目，前端 nuxt 项目，和 tauri 项目，它们都是从旧的项目 I:\Desktops\LofiTickDesktop 中分离出来的，所以它们的设计和实现，因为我打算把api拆开，ui拆开，客户端拆开，这样方便扩展更灵活。

# 其他说明
- 我知道，前端没有100%的隐藏方案，我这个方案只是为了提高门槛，让普通人无法轻易破解。
- 即使被破解了，也只能合法访问到 api 的接口，就像普通网站做的那样的公开接口一样，就算废了九牛二虎之力破解了签名算法，也只能访问到公开接口，无法访问到其他接口。因为这是url签名，又不是登录用的jwt。
- 当然了，如果你有更好的设计方案，也可以提出来，我们一起讨论一下。总之，我的这个设计方案，是基于我对前端安全的理解和经验的，如果你有更好的设计方案，我也非常欢迎你提出来，我们一起讨论一下，看看哪个方案更合理，更安全，更易于实现。
