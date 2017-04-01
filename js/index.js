//https://api.twitch.tv/kraken
//Client ID: r9e9n5yuf7px8bjh0vluifu48gxm9v

$(document).ready(function() {

  let div = $("<div class='game'></div>");
  let limit = 100;

  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/games/top?limit=100',
    headers: {
      'Client-ID': 'r9e9n5yuf7px8bjh0vluifu48gxm9v'
    },
    success: function(data) {

        //box art
        // console.log(data.top[0].game.box)

        //game
        // console.log(data.top[0].game.name)
        //.slice(16)

        let count = 0;

        $("#scrollRight").click(function() {
          count++;
          if (count !== 0) {
            $("#scrollLeft").css("visibility", "visible");

          }
          getGames();
        });

        $("#scrollLeft").click(function() {
          if (count !== 0) {
            count--;
          }
          console.log(count);
          getGames();
        });

        function getGames() {

          if (count === 0) {
            console.log("count is 0");
            $("#scrollLeft").css("visibility", "hidden");
          }

          let gameData = data.top.slice(count);
          // console.log(count)

          $.each(gameData, function(index, value) {
            let idIndex = index.toString();
            $("#game" + idIndex).html("");
            $("#game" + idIndex).append('<img src="' + value.game.box.large + '"alt="boxart"/>');
            $("#game" + idIndex).attr("game-name", value.game.name);

            if (value.game.name.length > 15) {
              let shortenedName = value.game.name.slice(0, 16) + "...";
              $("#game" + idIndex).append(shortenedName);
            } else {
              $("#game" + idIndex).append(value.game.name);
            }

          }); //each

        }

        let clipIndex = 0;
        let lastGame;
        let gameClicked;

        $("#new-clip-button").click(function() {
          $("#placeholder").show();
          clipIndex++;
          getClips(lastGame);
        });

        function getClips(game) {
          $(".spinner").show();
          $("#clips-display").html('');
          let httpRequest = new XMLHttpRequest();

          httpRequest.addEventListener('load', clipsLoaded);
          httpRequest.open('GET', 'https://api.twitch.tv/kraken/clips/top?limit=100&game=' + game + '&trending=true&period=day');
          httpRequest.setRequestHeader('Client-ID', 'r9e9n5yuf7px8bjh0vluifu48gxm9v');
          httpRequest.setRequestHeader('Accept', 'application/vnd.twitchtv.v4+json');
          httpRequest.send();

          function clipsLoaded() {
            let clipsDisplay = document.getElementById('clips-display'),
              clipList = JSON.parse(httpRequest.responseText);

            clipList.clips.slice(clipIndex, clipIndex + 1).forEach(function(clip, index, array) {
              clipItem = document.createElement('div')
              clipItem.setAttribute("id", "clip");
              clipItem.innerHTML = clip.embed_html;

              clipsDisplay.appendChild(clipItem);

              $(".spinner").slideUp(1200, function() {});
              $("#app").css("margin-top", "0px");

              if ($("#clip").css("display") === "none") {
                $("#clip").slideDown(1150, function() {});
                $("#clip").css("display", "block");
              }

              if ($(window).width() < 550) {
                $("#clip").children("iframe").attr("width", "500");
              } else if ($(window).width() < 400) {
                $("#clip").children("iframe").attr("width", "250");
              } else {
                $(window).width()
                $("#clip").children("iframe").attr("width", "700");

              }
            });

            $("#new-clip-button").show();
          }

        } //getClips

        $("#game1, #game2, #game3, #game4, #game5").click(function() {
          $(".spinner").show();
          $("#instructions").hide(); 
          getClips($("#" + this.id).attr("game-name"));
          lastGame = $("#" + this.id).attr("game-name");
        });

        $(".spinner").hide();
        $("#app").show().css("margin", "0px");
        getGames();
      } //success

  }); //ajax

}); //documentReady