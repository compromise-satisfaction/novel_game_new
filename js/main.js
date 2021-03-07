enchant();

function Game_load(width,height){

  var game = new Game(width,height);
  var Scene_kazu = 1;
  var Setting_Flag = {
    人物ページ:0,
    アイテムページ:0,
    BGM音量:5,
    音声音量:5,
    効果音音量:5,
    自由:"自由",
    名前:"名前",
    苗字:"苗字",
    性別:"未設定",
    一人称:"一人称",
    二人称:"二人称",
    オートセーブ:true,
    演出スキップ:false,
    シーンナンバー:"スタート"
  };

  game.fps = 100;
  game.onload = function(){

  function Sound_branch(a){
      if(a=="無し") return;
      for (var i = 0; i < SE.length; i++) {
        if(SE[i].title == a) break;
      }
      switch(SE[i].type){
        case "音声":
          var Volume = Setting_Flag.音声音量;
          break;
        case "効果音":
          var Volume = Setting_Flag.効果音音量;
          break;
        default:
          var Volume = Setting_Flag.BGM音量;
          break;
      }
      if(Volume){
        Volume /= 10;
        SE[i].volume = Volume;
        if(SE[i].paused) SE[i].play();
        else SE[i].currentTime = 0;
      }
      else{
        if(SE[i].paused==false) SE[i].pause();
      }
      return;
    }

  var Novel_MainScene = function(Data){

    var scene = new Scene();                                // 新しいシーンを作る

    var Image = [];

    function Images(a){
      Image[i] = new Sprite();
      Image[i]._element = document.createElement("img");
      Image[i]._element.src = "画像/透明.png";
      Image[i].imageurl = a.split(",")[0];
      Image[i].x = a.split(",")[1]*1;
      Image[i].y = a.split(",")[2]*1;
      Image[i].width = a.split(",")[3]*1;
      Image[i].height = a.split(",")[4]*1;
      Image[i].fade = false;
      if(a.split(",")[5]){
        if(a.split(",")[5].substring(0,4)=="fade"){
          Image[i].fade = a.split(",")[5].substring(4);
        }
        else{
          Image[i].addEventListener("touchend",function(e){
            for (var i = 0; i < Game_Datas.length; i++) {
              if(Game_Datas[i].Number==a.split(",")[5]) break;
            }
            if(i < Game_Datas.length) game.replaceScene(Novel_MainScene(Game_Datas[i].Data));
            else game.replaceScene(Novel_MainScene("(ボタン:エラー,0,0,405,600,スタート)"));
          });
        }
      }
      scene.addChild(Image[i]);
      return;
    }

    var Button = [];

    function Buttons(a){
      Button[i] = new Entity();
      Button[i].moveTo(a.split(",")[1]*1,a.split(",")[2]*1);
      Button[i].width = a.split(",")[3];
      Button[i].height = a.split(",")[4];
      Button[i]._element = document.createElement("input");
      Button[i]._element.type = "submit";
      Button[i]._element.value = a.split(",")[0];
      Button[i].backgroundColor = "buttonface";
      if(false){
        Button[i]._element.value += " ✓";
        Button[i].backgroundColor = "red";
      }
      Button[i]._element.onclick = function(e){
        if(a.split(",")[6]) Sound_branch(a.split(",")[6]);
        else Sound_branch("無し");
        switch(a.split(",")[7]){
          case "人物":
          case "アイテム":
            if(Scene_kazu == 1){
              game.pushScene(Novel_MainScene(a.split(",")[7]));
              Scene_kazu++;
            }
            else game.replaceScene(Novel_MainScene(a.split(",")[7]));
            return;
            break;
          case "popScene":
            game.popScene();
            Scene_kazu--;
            return;
            break;
          default:
            Setting_Flag.シーンナンバー = a.split(",")[5];
            break;
        }
        for (var i = 0; i < Game_Datas.length; i++) {
          if(Game_Datas[i].Number==a.split(",")[5]) break;
        }
        if(i < Game_Datas.length) game.replaceScene(Novel_MainScene(Game_Datas[i].Data));
        else game.replaceScene(Novel_MainScene("(ボタン:エラー,0,0,405,600,スタート)"));
        return;
      };
    }

    var Images_Data = Data.match(/\(画像:.+?\)/g);

    if(Images_Data){
      var Image_Number = 0;
      for (var i = 0; i < Images_Data.length; i++) {
        Images_Data[i] = Images_Data[i].substring(4,Images_Data[i].length-1);
        Images(Images_Data[i]);
      }
      Data = Data.replace(/\(画像:.+?\)/g,"●");//テキストを消費
    }

    var White_Background = new Sprite();
    White_Background._element = document.createElement("img");
    switch(Data){
      case "アイテム":
        White_Background._element.src = "画像/メニュー背景.png";
        White_Background.height = height;
        Data  = "(ボタン:戻る,30,30,80,40,popScene,戻る,popScene)";
        Data += "(ボタン:設定,162.5,30,80,40,popScene,メニュー)";
        Data += "(ボタン:人物,295,30,80,40,人物,メニュー,人物)";
        break;
      case "人物":
        White_Background._element.src = "画像/メニュー背景.png";
        White_Background.height = height;
        Data  = "(ボタン:戻る,30,30,80,40,popScene,戻る,popScene)";
        Data += "(ボタン:設定,162.5,30,80,40,popScene,メニュー)";
        Data += "(ボタン:アイテム,295,30,80,40,アイテム,メニュー,アイテム)";
        break;
      default:
        White_Background._element.src = "画像/白.png";
        White_Background.y = width/16*9;
        White_Background.height = height-width/16*9;
        break;
    }
    White_Background.width = width;
    scene.addChild(White_Background);

    var Buttons_Data = Data.match(/\(ボタン:.+?\)/g);

    if(Buttons_Data){
      var Button_Number = 0;
      for (var i = 0; i < Buttons_Data.length; i++) {
        Buttons_Data[i] = Buttons_Data[i].substring(5,Buttons_Data[i].length-1);
        Buttons(Buttons_Data[i]);
      }
      Data = Data.replace(/\(ボタン:.+?\)/g,"Θ");//テキストを消費
    }

    var Text_informations_Data = Data.match(/\(文字情報:.+?\)/g);

    if(Text_informations_Data){
      var Text_information_Number = 0;
      for (var i = 0; i < Text_informations_Data.length; i++) {
        Text_informations_Data[i] = Text_informations_Data[i].substring(6,Text_informations_Data[i].length-1);
      }
      Data = Data.replace(/\(文字情報:.+?\)/g,"¶");//テキストを消費
    }

    var Speeds_Data = Data.match(/\(待機時間:.+?\)/g);

    if(Speeds_Data){
      var Speed_Number = 0;
      for (var i = 0; i < Speeds_Data.length; i++) {
        Speeds_Data[i] = Speeds_Data[i].substring(6,Speeds_Data[i].length-1);
      }
      Data = Data.replace(/\(待機時間:.+?\)/g,"δ");//テキストを消費
    }

    var Sounds_Data = Data.match(/\(再生:.+?\)/g);

    if(Sounds_Data){
      var Sound_Number = 0;
      for (var i = 0; i < Sounds_Data.length; i++) {
        Sounds_Data[i] = Sounds_Data[i].substring(4,Sounds_Data[i].length-1);
      }
      Data = Data.replace(/\(再生:.+?\)/g,"Ψ");//テキストを消費
    }

    var Coordinates_Data = Data.match(/\(文字座標:.+?\)/g);

    if(Coordinates_Data){
      var Coordinate_Number = 0;
      for (var i = 0; i < Coordinates_Data.length; i++) {
        Coordinates_Data[i] = Coordinates_Data[i].substring(6,Coordinates_Data[i].length-1);
      }
      Data = Data.replace(/\(文字座標:.+?\)/g,"±");//テキストを消費
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

    var PX = width/20;
    var Text_X = width/20;
    var Text_Y = width/20 + width/20 + width/16*9;
    var Text_Sound = "無し";
    var Text_Color = "black";
    var Text_Number = 0;
    var Itimozi = null;
    var FPS = 5;
    var Display_time = 0;

    function Texts(){
      Itimozi = Data[Text_Number];
      if(!Itimozi) return;
      switch (Itimozi) {
        case "●":
          if(Image[Image_Number].fade){
            if(Image[Image_Number].fade.substring(0,2)=="in"){
              Image[Image_Number].opacity = 0;
              Image[Image_Number].tl.fadeIn(Image[Image_Number].fade.substring(2)*1);
            }
            else{
              Image[Image_Number].tl.fadeOut(Image[Image_Number].fade.substring(3)*1);
            }
          }
          Image[Image_Number]._element.src = Image[Image_Number].imageurl
          Image_Number++;
          Text_Number++;
          Texts();
          return;
          break;
        case "Θ":
          scene.addChild(Button[Button_Number]);
          Button_Number++;
          Text_Number++;
          Texts();
          return;
          break;
        case "¶":
          PX = Text_informations_Data[Text_information_Number].split(",")[0]*1;
          Text_Color = Text_informations_Data[Text_information_Number].split(",")[1];
          Text_Sound = Text_informations_Data[Text_information_Number].split(",")[2];
          Text_information_Number++
          Text_Number++;
          Texts();
          return;
          break;
        case "δ":
          FPS = Speeds_Data[Speed_Number];
          Speed_Number++
          Text_Number++;
          Texts();
          return;
          break;
        case "Ψ":
          Sound_branch(Sounds_Data[Sound_Number]);
          Sound_Number++
          Text_Number++;
          Texts();
          return;
          break;
        case "±":
          Text_X = Coordinates_Data[Coordinate_Number].split(",")[0]*1;
          Text_Y = Coordinates_Data[Coordinate_Number].split(",")[1]*1;
          Coordinate_Number++
          Text_Number++;
          Texts();
          return;
          break;
        case " ":
          Text_X += PX;
          Text_Number++;
          Texts();
          return;
          break;
        default:
          break;
      }
      Display_time++;
      if(Display_time%FPS!=0) return;
      Display_time = 0;
      Text[Text_Number] = new Sprite();
      Text[Text_Number]._element = document.createElement("innerHTML");
      Text[Text_Number]._style.font  = PX + "px monospace";
      Text[Text_Number]._element.textContent = Itimozi;
      Text[Text_Number].x = Text_X;
      Text[Text_Number].y = Text_Y;
      Text[Text_Number]._style.color = Text_Color;
      Text_X += PX;
      Sound_branch(Text_Sound);
      scene.addChild(Text[Text_Number]);
      Text_Number++;
      return;
    }

    Texts();

    White_Background.addEventListener("enterframe",function(){
      Texts();
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
     SE = [];
     var SE_Number = 0;
     for (var i = 0; i < result.length; i++) {
       if(result[i].Data.match(/\(音:.+?\)/)){
         result[i].Data = result[i].Data.substring(3,result[i].Data.length-1);
         SE[SE_Number] = document.createElement("audio");
         SE[SE_Number].src = result[i].Data.split(",")[0];
         SE[SE_Number].type = result[i].Data.split(",")[1];
         SE[SE_Number].title = result[i].Number;
         SE_Number++;
       }
     }
     game.replaceScene(Novel_MainScene("(ボタン:スタート,0,0,405,600,スタート)"));
     return;
    },);
}
game.start();
}
