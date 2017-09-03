window.$ = window.jQuery = require("jquery");

import CommentsService from "./CommentsService";
import CommentsListManager from "./CommentsListManager";
import CommentFormManager from "./CommentFormManager";
import PubSub from "pubsub-js";

const commentService = new CommentsService("/comments/");
const commentsListManager = new CommentsListManager(".comments-list", commentService, PubSub);

const commentFormManager = new CommentFormManager(".insert-comment", commentService, PubSub);


var dateput=$('.date-pub .datebbdd');
$.each(dateput,function(index,data){
    var fielddate =$(this).parent().find('.ago');
    var datepub=data.innerHTML;

    var dh=new Date(datepub);
    var stampdh=dh.getTime();

    var actual=new Date();
    var stampactual=actual.getTime();

    var minut=60000;
    var hour=minut*60;
    var dia=hour*24;
    var week=dia*7;

    var ago=stampactual-stampdh;
    console.log(stampactual,dh);
    if (ago > week){
        var onlydate=datepub.split(' ');
        console.log()
        fielddate.html(convertDateFormat(onlydate[0])+ ' '+ onlydate[1]);
    }else if(ago > dia){
        var dayweek=dayOfWeek(dh);
        fielddate.html(`El ${dayweek} pasado`);
    }else if(ago > hour){
        var gap=parseInt(ago/hour);
        if (gap==1){
            var uds='hora';
        }else{
            var uds='horas';
        }
        fielddate.html(`Hace ${gap} ${uds}`);
        
    }else if(ago > minut){
        var gap=parseInt(ago/minut);
        if (gap==1){
            var uds='minuto';
        }else{
            var uds='minutos';
        }
        fielddate.html(`Hace ${gap} ${uds}`);
    }else if(ago > 1000){
        var gap=parseInt(ago/1000);
        if (gap==1){
            var uds='segundo';
        }else{
            var uds='segundos';
        }
        fielddate.html(`Hace ${gap} ${uds}`);
    }else{
        fielddate.html(`Error de fecha`);
    }

})
function dayOfWeek(date){
    var dias = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[date.getDay()];
}
function convertDateFormat(string) {
    var info = string.split('-').reverse().join('/');
    return info;
}

$(document).ready(function(){
    $('.like').click(function(){
        var article = $(this).data('id');
        var likes = localStorage.getItem('id_'+article);
        if(likes){
            var count = parseInt(likes)+1;
            $(this).find('span').addClass('ilike');
        }else{
            var count = 1;
            $(this).find('span').addClass('ilike');
        }
        
        localStorage.setItem('id_'+article, count);
        var resul=localStorage.getItem('article');
        managelikes();
   });   
});

$('#totop').click(function(){
    $('body,html').animate({scrollTop : 0}, 500);
    return false;
});

$('#select_menu').on('click',function(){
    $('.menu li').toggleClass('hidden');
    $('.menu li').slideToggle('hidden');
});

function managelikes(){
    var likes=$('.like');
    $.each(likes,function(index,data){
        var article=data.dataset['id'];
        var like = localStorage.getItem('id_'+article);
        if(like){
            $(this).find('span').addClass('ilike');
            var conte='Me gusta<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
            $(this).find('span').html(like+' '+conte);
        }
    });
}
$(document).ready(function(){
    managelikes();
});

var arti=$('.article-text');
//console.log(arti);
if(arti.length !=0){
    $(window).scroll(function() {
        if($('.comments-list').is(":visible")){
            return;
        }
        
        var hT = $('.article-text').offset().top,
            hH = $('.article-text').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
        if (wS > (hT+hH-wH)){
            $('.comments-list').show();
            commentsListManager.init();
            
            commentFormManager.init();
        }
    });
}