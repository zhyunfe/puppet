// 使用puppeteer 进行截图操作

const puppeteer = require('puppeteer');

//async 函数返回一个Promise对象，可以使用then方法添加回调函数，当函数执行的时候，一旦遇到await就会先返回，等到出发的异步
//操作完成，再接着执行函数体内后面的语句

// 举个栗子 异步
var sleep = function(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('ok');
        }, time);
    })
}

var start = async function () {
    console.log('start');
    // 在这里表示在等待promise返回结果了再继续执行
    let result =  await sleep(3000);
    console.log(result);//收到ok
    console.log('end');
}
// 执行start后会等待3s后再打印end
start();
// await命令只能在async函数之中，如果在普通函数，就会报错
// await 只能使用在原生语法中，比如forEach结构中使用await是无法正常工作的，必须使用for循环的原生语法
(async() => {
    // puppeteer.launch(option)运行puppeteer会return一个promise，使用then方法获取browser实例
    // 可以使用的参数
    // ignoreHTTPSError boolean 在请求过程中是否忽略https报错信息，默认为false
    // headless         boolean 是否以无头模式运行chrome，也就是不显示UI，默认为true
    // executablePath   string  可执行文件路径，默认是使用它自带的chrome webdriver 
    // slowMo           number  操作减速，单位是毫秒
    // args             Array(String)   传递给chrome实例的其他参数
    // handleSIGINT     bollean 是否允许通过进程信号控制chrome进程，也就是是否使用CTRL+C关闭并推出浏览器
    // timeout          number  等待chrome实例启动的最长时间，默认为30000
    // dumpio           boolean 是否将浏览器集成stdout和stderr导入到process.stdout 和 process.stderr中，默认为false
    // userDataDir      string  设置用户数据目录 linux默认是在~/.config目录
    // env              Object  指定对Chromium可见的环境变量，默认为process.env
    // devtools         boolean 是否为每个选项卡自动打开DevTool面板，这个选项只有当headless设置为false时有效
    const browser = await puppeteer.launch();
    // Browser对象API https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md
    // browser.close() 关闭浏览器   browser.disconnect() 断开浏览器链接 browser.newPage() 创建一个Page实例
    // browser.pages() 获取所有打开的Page实例   browser.targets() 获取所有活动的targets
    // browser.version()    获取浏览器版本      browser.wsEndpoint 返回浏览器实例的socket链接URL
    const page = await browser.newPage();
    // Page对象提供了2个API来获取页面元素
    // Page.$(selector) 获取单个元素 底层调用的是document.querySelector()
    // Page.$$(selector) 获取一组元素 底层调用的是document.querySelectorAll() 返回Promise(Array(ElemetHandle))

    // 跳转到百度首页
    await page.goto('https://www.baidu.com');
    // 截屏并保存在这个路径下
    await page.screenshot({path: 'example.png'});
    // 生成pdf
    await page.pdf({path: 'example.pdf', format: 'A4'});
    // 关闭浏览器
    await browser.close();
})();
