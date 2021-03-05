enchant();

function Game_load(width,height){

  var game = new Game(width,height);

  game.fps = 100;
  game.onload = function(){

  var MainScene = function(Data){

    var scene = new Scene();                                // 新しいシーンを作る

    var Image = [];

    function Images(a){
      Image[i] = new Sprite();
      Image[i]._element = document.createElement("img");
      Image[i]._element.src = "画像/透明.png";
      Image[i].imageurl = a.split(",")[0];
      Image[i].x = a.split(",")[1];
      Image[i].y = a.split(",")[2];
      Image[i].width = a.split(",")[3];
      Image[i].height = a.split(",")[4];
      scene.addChild(Image[i]);
      return;
    }

    var Button = [];

    function Buttons(a){
      Button[i] = new Entity();
      Button[i].moveTo(a.split(",")[1]*1,a.split(",")[2]*1);
      Button[i].width = a.split(",")[3];
      Button[i].height = a.split(",")[4];
      Button[i]._element = document.createElement('input');
      Button[i]._element.type = "submit";
      Button[i]._element.value = a.split(",")[0];
      Button[i].backgroundColor = "buttonface";
      Button[i]._element.onclick = function(e){
        for (var i = 0; i < Game_Datas.length; i++) {
          if(Game_Datas[i].Number==a.split(",")[5]) break;
        }
        if(i < Game_Datas.length) game.replaceScene(MainScene(Game_Datas[i].Data));
        else game.replaceScene(MainScene("(ボタン:エラー,0,0,405,600,1)"));
      };
    }

    var White_Background = new Sprite();
    White_Background._element = document.createElement("img");
    White_Background._element.src = "画像/白.png";
    White_Background.y = width/16*9;
    White_Background.width = width;
    White_Background.height = height-width/16*9;
    scene.addChild(White_Background);

    var Images_Data = Data.match(/\(画像:.+?\)/g);

    if(Images_Data){
      var Image_Number = 0;
      for (var i = 0; i < Images_Data.length; i++) {
        Images_Data[i] = Images_Data[i].substring(4,Images_Data[i].length-1);
        Images(Images_Data[i]);
      }
      Data = Data.replace(/\(画像:.+?\)/g,"●");//テキストを消費
    }

    var Buttons_Data = Data.match(/\(ボタン:.+?\)/g);

    if(Buttons_Data){
      var Button_Number = 0;
      for (var i = 0; i < Buttons_Data.length; i++) {
        Buttons_Data[i] = Buttons_Data[i].substring(5,Buttons_Data[i].length-1);
        Buttons(Buttons_Data[i]);
      }
      Data = Data.replace(/\(ボタン:.+?\)/g,"Θ");//テキストを消費
    }

    var Name_texts = Data.match(/\(名前:.+?\)/g);

    if(Name_texts){
      Name_texts = Name_texts[0].substring(4,Name_texts[0].length-1);
      Name_texts = "【" + Name_texts + "】";
      var Name_text = new Sprite();
      Name_text._element = document.createElement("innerHTML");
      Name_text._style.font  = width/20 + "px monospace";
      Name_text._element.textContent = Name_texts;
      Name_text.x = 0;
      Name_text.y = width/30 + width/16*9;
      scene.addChild(Name_text);
      Data = Data.replace(/\(名前:.+?\)/g,"");//テキストを消費
    }

    var Text_X = width/20;
    var Text_Y = width/20 + width/20 + width/16*9;
    var Text_Color = "black";
    var Text_Number = 0;
    var Itimozi = null;
    var FPS = 4;
    var Display_time = 0;

    function Texts(a,b,x,y){
      Itimozi = Data[Text_Number];
      switch (Itimozi) {
        case "●":
          Image[Image_Number]._element.src = Image[Image_Number].imageurl
          Image_Number++;
          return(true);
          break;
        case "Θ":
          scene.addChild(Button[Button_Number]);
          Button_Number++;
          return(true);
          break;
      }
      Display_time++;
      if(Display_time%FPS!=0) return(false);
      Display_time = 0;
      Text[a] = new Sprite();
      Text[a]._element = document.createElement("innerHTML");
      Text[a]._style.font  = width/20 + "px monospace";
      Text[a]._element.textContent = Itimozi;
      Text[a].x = x;
      Text[a].y = y;
      Text[a]._style.color = b;
      Text_X += width/20;
      scene.addChild(Text[a]);
      return(true);
    }

    White_Background.addEventListener("enterframe",function(){
      if(!Data[Text_Number]) return;
      if(Texts(Text_Number,Text_Color,Text_X,Text_Y)) Text_Number++;
      return;
    });

    return scene;
  };
  fetch
  (
    "https://script.google.com/macros/s/AKfycbwbxBARHidLzHA52cznZ2VI_x9hdNtW2RHnk5bV_dm1QU7A2eI/exec",
    {
      method: "POST"
    }
  ).then(res => res.json()).then(result => {
     Game_Datas = result;
     game.replaceScene(MainScene("準備オーケー(ボタン:スタート,324,519,81,81,1)"));
     return;
    },);
}
game.start();
}
