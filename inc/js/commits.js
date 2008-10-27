function githubCallback(json) {

  var commits = json.user.repositories;
	var username = "lachlanhardy";
	var script = "";
	var comts = [];
  var repos = [];
  var sorter = function (a, b) {
    return a.committed_date <= b.committed_date ? 1 : -1;
  };
  
  
  
  $.each(commits, function(i){
    if (!commits[i]["private"]) {
      repos.push(commits[i]);
    }
  });
  
  $.each(repos, function(i){
      $.getJSON("http://github.com/api/v1/json/" + username + "/" + repos[i].name + "/commits/master?callback=?",
        function(data){
          data.commits.sort(sorter);
          data.commits[0].name = repos[i].name;
          data.commits[0].description = repos[i].description;
          data.commits[0].repoURL = repos[i].url;
          comts.push(data.commits[0]);
          if (repos.length == comts.length) {
            comts.sort(sorter);
            alert(comts[0].name);
          }
        } 
      );
  });
}

var addGithub = function() {

  var mainScript = $(document.createElement("script"));
  mainScript.attr("src", "http://github.com/api/v1/json/lachlanhardy?callback=githubCallback");
  // mainScript.attr("src", "test/github.js");
  
  $("body").append(mainScript);
};
