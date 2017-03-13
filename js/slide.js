(function () {
    function autoSlide() {}
    
    autoSlide.prototype.init = function (initParam) {
        //都在这里初始化
        this.dsq=null;
        //判断是手机还是电脑打开，选择初始化
        if(!this.isPhone()){
            this.phoneSlide(initParam); //initParam是形参
        }else{
            this.computerSlide(initParam);
        }
    }
    autoSlide.prototype.computerSlide=function (param) {//电脑端初始化
        var _this = this;//区分作用域
        var divEle = document.createElement("div");//创建一个图片列表box
        divEle.className = "slide-box";
        var divFocus = document.createElement("div"); //创建一个图片焦点
        divFocus.className = "slide-focus";
        for(var i=0;i<param.slideLi.length;i++){
            var slideItem = document.createElement("div");//创建图片项目
            var focusItem = document.createElement("span");
            focusItem.setAttribute("data-index",i);
            if(i == 0){
                slideItem.className = "active";
                focusItem.className = "on";
            }
            //注意不要使用mousemove，会导致重复调用
            focusItem.onmousemove = function () {
                if(this.className.indexOf("on") < 0){
                    document.getElementsByClassName("on")[0].className = "";//清除之前的标记
                    this.className = "on";//设置当前的状态
                    divEle.getElementsByClassName("active")[0].className = "";//清除
                    divEle.children[this.getAttribute("data-index")].className = "active";//设置当前的标记
                }
            }

            //querySelectorAll获取出来的是一个数组，所以要选择第几个
            slideItem.style.backgroundImage = "url('"+param.slideLi[i].querySelectorAll("img")[0].getAttribute("src")+"')"; //这里也需要像css一样，写url();
            divEle.appendChild(slideItem);//存储到图片列表box
            divFocus.appendChild(focusItem);//存储span元素到图片焦点box
        }

        document.getElementById("slidePic").remove();
        var focus = document.getElementById("focus");
        focus.onmousemove = function(){
            clearTimeout(_this.dsq);
        }
        focus.onmouseout = function(){
            _this.computerAuto();
        }
        focus.appendChild(divEle);
        focus.appendChild(divFocus);
        this.computerAuto();
    }

    autoSlide.prototype.computerAuto=function () { //自动播放
        /*
         1、获取当前是第几个
         2、获取总共有多少个
         3、匹配如果当前是最后一个，那么下一个就是第一个
         4、调用定时器自动执行（setInterval有Bug，长期调用，可能会导致越来越快）
         */
        var _this = this;
        this.dsq = setTimeout(function () {
            var slideBox = document.getElementsByClassName("slide-box")[0].children;
            var slideFocus = document.getElementsByClassName("slide-focus")[0].children;
            var currFocus = Number(document.getElementsByClassName("slide-focus")[0].getElementsByClassName("on")[0].getAttribute("data-index"));
            slideBox[currFocus].className = "";
            slideFocus[currFocus].className = "";
            if((slideBox.length-1) <= currFocus){
                slideBox[0].className = "active";
                slideFocus[0].className = "on";
            }else{
                slideBox[currFocus+1].className = "active";
                slideFocus[currFocus+1].className = "on";
            }
            _this.computerAuto();
        },3000)
    }
    autoSlide.prototype.phoneSlide=function () {//手机端初始化

    }
    autoSlide.prototype.isPhone = function () {
        var userAgentInfo = navigator.userAgent //查看浏览器用于 HTTP 请求的用户代理头的值
        var agents = ["Android", "iPhone",
                     "SymbianOS", "Windows Phone",
                     "iPad", "iPod"];//系统名字
        var flag = true;
        for(var i=0;i<agents.length;i++){
            if(userAgentInfo.indexOf(agents[i]) > 0){
                flag = false; //判断是否包含，修改flag状态
                break;//结束for循环判断
            }
        }
       return flag
    }

    var autoSlides = new autoSlide();

    window["autoSlide"] = autoSlides;
})()  //自执行函数