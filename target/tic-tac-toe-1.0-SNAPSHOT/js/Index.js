function checkLogin(){
    $.get('/index', function(data) {
        alert(data);
    });
}
