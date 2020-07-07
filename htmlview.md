
## 存储方式

* cookies、localstorage、sessionstorage、Web SQL、IndexedDB
  
### 存储方式的区别
* cookies: 在HTML5标准前本地存储的主要方式，优点是兼容性好，请求头自带cookie方便，缺点是只有4k大小，自动请求头加入cookies浪费流量，每个domain限制20个cookie，使用起来麻烦需要自行封装
* localStorage: HTML5加入的以键值对的方式永久存储数据的方式，优点是使用方便，永久存储，大小5M，兼容IE8以上
* sessionStorage: 与localStorage基本类似，区别在sessionStorage当前页被关闭的时候会被清除，而且与cookie、localStorage不同，它不能再所有同源窗口中共享，是会话级别的存储。
* Web SQL: 2010年被W3C废弃的本地数据库存储方案，但是主流浏览器（火狐除外）都已经有了相关的实现，web sql类似于SQLite，是真正意义上的关系型数据库，用sql进行操作，使用js进行操作的时候需要转换
* IndexedDB: 正式被纳入HTML5标准的数据库存储方式，它是noSQL数据库，使用键值对进行存储，可进行快速读取操作，非常适合web场景，同时使用js进行操作会非常方便。
  
