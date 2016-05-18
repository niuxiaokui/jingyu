// window.AudioContext = window.AudioContext || window.mozAudioContext || window.webkitAudioContext;
// // 兼容浏览器  
// try {    var audioContext = new window.AudioContext();} catch (e) {    Console.log('!Your browser does not support AudioContext');}
var AudioContext = window.AudioContext || window.webkitAudioContext;
window.onload = function() {



    var audio = document.getElementById('audio');
    var ctx = new AudioContext();
    // new 一个新的音频对象
    var analyser = ctx.createAnalyser();      
    // 创建一个分析节点 analyser node
    var audioSrc = ctx.createMediaElementSource(audio);
    // 从 <audio>元素创建一个MediaElementAudioSourceNode(媒体元素音频源结点) . */
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);  //连接CTX  音频对象 将 MediaElementAudioSourceNode 与 AudioContext 关联
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    // var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
    var canvas = document.getElementById('canvas'),
        cwidth = canvas.width,    
        cheight = canvas.height - 2,
        meterWidth = 10, 
        gap = 2, 
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 800 / (10 + 2), 
    // 线柱的个数 
        capYPositionArray = []; 
    // 初始化caps的初始位置 数组
    ctx = canvas.getContext('2d'),
    // 设置画布为2d
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
    // 创建一个渐变的画布，从 height  开始变化 线性渐变
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.9, 'yellow');
    gradient.addColorStop(0.5, 'red');
    // 给画布加渐变颜色   
    // loop
    function renderFrame() {
         // 首先你要对数字信号处理有一定了解，吓人的，不了解也没多大关系。频谱反应的是声音各频率上能量的分布，所以叫能量槽也没有硬要跟游戏联系起来的嫌疑，是将输入的信号经过傅里叶变化得到的（大学里的知识终于还是可以派得上用场了）真实的频谱图是频率上连续的，不是我们看到的最终效果那样均匀分开锯齿状的。

      // 通过下面的代码我们可以从analyser中得到此刻的音频中各频率的能量值。
        var array = new Uint8Array(analyser.frequencyBinCount);   //定义一个 Uint8Array 字节流去接收分析后的数据
        analyser.getByteFrequencyData(array); //为了获取频率和能量数据

        var step = Math.round(array.length / meterNum); 
        //取样步长，抽样
        ctx.clearRect(0, 0, cwidth, cheight);
        // 清空画布 
        // array[0]=100,我们就知道在x=0处画一个高为100单位长度的长条，array[1]=50，然后在x=1画一个高为50单位长度的柱条，从此类推，如果用一个for循环遍历array将其全部画出
        for (var i = 0; i < meterNum; i++) {
            // array 长度为1024;把有效的，我们实际要用的随机抽出能量值的 array[i*step] 取出来
            var value = array[i * step];
            // 超出个数，我们用不到，所以不考虑
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;   
            // 绘制cap 的 颜色 ，白色
            //计算出随音频播放的变化的cap的实际位置
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            }
             else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient; //给线柱画上渐变的颜色
            ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); 
            //绘制线柱
        }
        requestAnimationFrame(renderFrame); //波形可视化地输出来,使用DOM节点和 requestAnimationFrame.类似回调函数(setTimeout)浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用
    }
    renderFrame();
    audio.play();
};


// // 第二个
// var AudioContext = window.AudioContext || window.webkitAudioContext; //Cross browser variant.

// var canvas, ctx;
// var audioContext;
// var file;
// var fileContent;
// var audioBufferSourceNode;
// var analyser;

// var loadFile = function() {
//     var fileReader = new FileReader();
//     fileReader.onload = function(e) {
//         fileContent = e.target.result;
//         decodecFile();
//     }
//     fileReader.readAsArrayBuffer(file);
// }

// var decodecFile = function() {
//     audioContext.decodeAudioData(fileContent, function(buffer) {
//         start(buffer);
//     });
// }

// var start = function(buffer) {
//     if(audioBufferSourceNode) {
//         audioBufferSourceNode.stop();
//     }

//     audioBufferSourceNode = audioContext.createBufferSource();
//     audioBufferSourceNode.connect(analyser);
//     analyser.connect(audioContext.destination);
//     audioBufferSourceNode.buffer = buffer;
//     audioBufferSourceNode.start(0);
//     showTip(false);
//     window.requestAnimationFrame(render);
// }

// var showTip = function(show) {
//     var tip = document.getElementById('tip');
//     if (show) {
//         tip.className = "show";
//     } else {
//         tip.className = "";
//     }
// }

// var render = function() {
//     ctx = canvas.getContext("2d");
//     ctx.strokeStyle = "#00d0ff";
//     ctx.lineWidth = 2;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     var dataArray = new Uint8Array(analyser.frequencyBinCount);
//     analyser.getByteFrequencyData(dataArray);
//     var step = Math.round(dataArray.length / 60);

//     for (var i = 0; i < 40; i++) {
//         var energy = (dataArray[step * i] / 256.0) * 50;
//         for (var j = 0; j < energy; j++) {
//             ctx.beginPath();
//             ctx.moveTo(20 * i + 2, 200 + 4 * j);
//             ctx.lineTo(20 * (i + 1) - 2, 200 + 4 * j);
//             ctx.stroke();
//             ctx.beginPath();
//             ctx.moveTo(20 * i + 2, 200 - 4 * j);
//             ctx.lineTo(20 * (i + 1) - 2, 200 - 4 * j);
//             ctx.stroke();
//         }
//         ctx.beginPath();
//         ctx.moveTo(20 * i + 2, 200);
//         ctx.lineTo(20 * (i + 1) - 2, 200);
//         ctx.stroke();
//     }

//     window.requestAnimationFrame(render);
// }

// window.onload = function() {
//     audioContext = new AudioContext();
//     analyser = audioContext.createAnalyser();
//     analyser.fftSize = 256;

//     var fileChooser = document.getElementById('fileChooser');
//     fileChooser.onchange= function() {
//         if (fileChooser.files[0]) {
//             file = fileChooser.files[0];
//             showTip(true);
//             loadFile();
//         }
//     }

//     canvas = document.getElementById('visualizer');
// }