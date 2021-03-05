enchant();

var BGM = document.createElement("audio");
BGM.addEventListener("ended",function(e){
  BGM.currentTime = BGM.id*1;
  BGM.play();
});

function Game_load(width,height){
  var game = new Game(width,height);

  game.fps = 100;
  game.onload = function(){

  var Now = new Date().getTime();

  var MainScene = function(Datas){
    var scene = new Scene();                                // 新しいシーンを作る

    var Background = new Sprite();
    Background._element = document.createElement("img");
    Background._element.src = "画像/黒.png";
    Background.width = width;
    Background.height = width/16*9;
    scene.addChild(Background);

    var White_Background = new Sprite();
    White_Background._element = document.createElement("img");
    White_Background._element.src = "画像/白.png";
    White_Background.y = width/16*9;
    White_Background.width = width;
    White_Background.height = height-width/16*9;
    scene.addChild(White_Background);

    var Numbers = width/16*9+width/20+width/25;
    var Text_Numbers = 0;

    function Texts(){
      if(i%18==0) Numbers += width/20+width/25;
      Text[i] = new Sprite();
      Text[i]._element = document.createElement("innerHTML");
      Text[i]._style.font  = width/20+"px monospace";
      Text[i]._element.textContent = "";
      Text[i].x = width/20 + width/20*(i%18);
      Text[i].y = Numbers;
      Text[i]._style.color = "black";
      scene.addChild(Text[i]);
    }//会話文

    var Text =[];

    for (var i = 0; i < 108; i++) {
      Texts();
    }

    var Text_Data = "テストテストテストテストテストテストテストテストテストテストテストテスト";
    var Fps = 4;
    var Frame = 0;

    var Sounds = [];
    Sounds[0] = document.createElement("audio");
    Sounds[0].src = "https://raw.githubusercontent.com/compromise-satisfaction/Saved/master/音/効果音/ポポポ(男).wav";

    function T_D(i){
      Text[i]._element.textContent = Text_Data[i];
      if(Sounds[0].paused) Sounds[0].play();
      else Sounds[0].currentTime = 0;
    };

    White_Background.addEventListener("enterframe",function(){
      if(Text_Numbers==Text_Data.length) return;
      Frame++;
      if(Frame%Fps!=0) return;
      T_D(Text_Numbers);
      Text_Numbers++;
    });

    return scene;
  };
  game.replaceScene(MainScene());
}
game.start();
}
