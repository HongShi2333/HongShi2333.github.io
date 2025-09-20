var posts=["/post/62072.html","/post/45382.html","/post/26312.html"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };