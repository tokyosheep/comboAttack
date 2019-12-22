
window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    
    const content = document.getElementById("content");
    const myCanvas = document.getElementById("myCanvas");
    const centerX = myCanvas.width/2
    const centerY = myCanvas.height/2;

    const stage = new createjs.Stage("myCanvas");

    class Explotion{//effect
        constructor(num){
            this.shape = new createjs.Shape();
            this.shape.graphics.beginStroke(isNaN(num) ?  "white": createjs.Graphics.getHSL(num, 50, 50));
            this.shape.graphics.setStrokeStyle(5);
            this.shape.graphics.drawCircle(0,0,80);
            this.shape.x = centerX;
            this.shape.y = centerY;
            stage.addChild(this.shape);
        }

        explode(){
            createjs.Tween.get(this.shape)
                .to({scale:3,alpha:0},3000)
                .call(this.disapear);
        }

        disapear(){
            stage.removeChild(this.Child);
        }
    }
    

    class ComboCount{//combo class
        constructor(num,initialSize,initAlpha,stopFlag = false){
            this.stopFlag = stopFlag;
            this.count = 0;
            this.fontSize = initialSize;
            this.shape = new createjs.Text(num, this.fontSize+"px serif","white");
            this.shape.alpha = initAlpha;
            this.shape.y = centerY;
            this.shape.x = centerX;
            this.shape.scale = 1;
            this.shape.textAlign = "center";
            this.shape.BaseLine = "middle";
            this.shape.regY = this.fontSize/2;
            stage.addChild(this.shape);
            createjs.Ticker.addEventListener("tick",this);
        }

        handleEvent(){
            this.shape.alpha -= 0.05;
            this.shape.font = (this.fontSize+this.count)+"px serif";
            this.shape.rotation += 0.5;
            this.count+=2;
            if(this.shape.alpha < 0.1){
                stage.removeChild(this.shape);
                if(this.stopFlag){
                    setTimeout(()=>{
                        createjs.removeEventListener("tick",stage);
                    },100);
                }
                /*stop watch tick event */
            }
        }  
    }
    

    /*timer*/ 
    const limitTime = 50;
    let countDown = 0;
    createjs.Ticker.addEventListener("tick",()=>{
        countDown++
        if(countDown > limitTime){
            const miss = new ComboCount("miss",80,0.5,true);
            content.dataset.count = countDown = 0;
        }
    });


    csInterface.addEventListener("documentEdited",(e)=>{
        /*edited event*/
        countDown = 0;
        let num = parseFloat(content.dataset.count);//pic number out from dataset
        /*dispatch watch tick event when launch to edit document*/
        if(num === 0)createjs.Ticker.addEventListener("tick", stage);
        num++
        content.dataset.count = num;//set count number on dataset
        const counting = new ComboCount(num,200,1);
        const combo = new ComboCount("combo",80,0.5);
        const circle = new Explotion(num);
        circle.explode();
    });

    
}
