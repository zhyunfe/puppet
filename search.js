// 使用puppetter打开京东首页
// 搜索手机关键字
// 获取搜索列表中的链接
// 打开链接
// 截全屏

function sleep(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (e) {
                reject(0)
            }
        }, delay)
    })
}

const puppeteer = require('puppeteer');
puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: false,
    // devtools: true,
    slowMo:250,
    timeout:0
}).then(async browser => {
    let page = await browser.newPage();
    await page.setJavaScriptEnabled(true);
    await page.goto('https://www.jd.com');
    // 查找搜索框对象
    const searchInput = await page.$("#key");
    // 定位到搜索框
    await searchInput.focus();
    // 输入手机
    await page.keyboard.type("手机");
    // 查找提交按钮
    const searchBtn = await page.$(".button");
    // 点击提交
    await searchBtn.click();
    // 等待元素加载之后获取到列表
    await page.waitForSelector('.gl-item');
    // 返回搜到的所有的链接
    const links = await page.$$eval('.gl-item > .gl-i-wrap > .p-img > a', links => {
        return links.map(a => {
            return {
                href: a.href.trim(),
                tittle: a.tittle
            }
        })
    })
    console.log(links);
    page.close();
    // 每10个一页
    const aTags = links.splice(0, 10);
    console.log(aTags);
    for (var i = 1; i < aTags.length; i++) {
        page = await browser.newPage();
        page.setJavaScriptEnabled(true);
        // 设置页面尺寸
        await page.setViewport({width: 1920, height:1080});
        var a = aTags[i];
        // 访问链接
        await page.goto(a.href, {timeout: 0});
        // // 滚动页面到底部
        // let scrollEnable = true;
        // // 每次500像素
        // let scrollStep = 500;

        // while(scrollEnable) {
        //     scrollEnable = await page.evaluate((scrollStep) => {
        //         let scrollTop = document.scrollingElement.scrollTop;
        //         document.scrollingElement.scrollTop = scrollTop + scrollStep;
        //         return document.body.clientHeight > scrollTop + 1080 ? true : false
        //     }, scrollStep);
        //     await sleep(100);
        // }
        // // 等到加载到底部
        // await page.waitForSelector("#footer-2017", {timeout:0})

        await page.waitFor(5000);
        let filename = "images/items-"+i+".png";
        // 开始截屏
        await page.screenshot({path: filename, fullPage:true});
        page.close();
    }
    browser.close();
})