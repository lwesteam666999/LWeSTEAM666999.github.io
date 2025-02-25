// 新增配置项
const FPS_CHECK_INTERVAL = 5000; // 每5秒检测一次
let checkTimer = null;
let frameCount = 0;
let lastCheckTime = Date.now();

if (window.localStorage.getItem("fpson") === null || window.localStorage.getItem("fpson") === "1") {
    // 帧计数器
    const countFrame = () => {
        frameCount++;
        requestAnimationFrame(countFrame);
    };
    
    // 启动计数
    requestAnimationFrame(countFrame);

    // 定时检测
    const checkFPS = () => {
        const now = Date.now();
        const elapsed = now - lastCheckTime;
        const fps = Math.round((frameCount * 1000) / elapsed);

        // 显示逻辑（保持原样）
        let kd;
        if (fps <= 5) {
            kd = `<span style="color:#bd0000">卡成ppt🤢</span>`;
        } else if (fps <= 15) {
            kd = `<span style="color:red">电竞级帧率😖</span>`;
        } else if (fps <= 25) {
            kd = `<span style="color:orange">有点难受😨</span>`;
        } else if (fps < 35) {
            kd = `<span style="color:#9338e6">不太流畅🙄</span>`;
        } else if (fps <= 45) {
            kd = `<span style="color:#08b7e4">还不错哦😁</span>`;
        } else {
            kd = `<span style="color:#39c5bb">十分流畅🤣</span>`;
        }

        // 安全DOM操作
        const fpsElement = document.getElementById("fps");
        if (fpsElement) {
            fpsElement.innerHTML = `FPS:${fps} ${kd}`;
        }

        // 重置计数器
        frameCount = 0;
        lastCheckTime = now;
    };

    // 启动定时检测
    checkTimer = setInterval(checkFPS, FPS_CHECK_INTERVAL);

    // 页面隐藏时暂停检测
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearInterval(checkTimer);
        } else {
            checkTimer = setInterval(checkFPS, FPS_CHECK_INTERVAL);
        }
    });
} else {
    const fpsElement = document.getElementById("fps");
    if (fpsElement) {
        fpsElement.style.display = "none";
    }
}