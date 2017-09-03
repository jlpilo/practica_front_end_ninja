import UIManager from './UIManager';

export default class CommentsListManager extends UIManager {

    constructor(elementSelector, commentsService, pubSub) {
        super(elementSelector); // llamada al constructor de la clase UIManager
        this.commentsService = commentsService;
        this.pubSub = pubSub;
    }

    init() {
        //console.log('aqui');
        this.loadComments();
        let self = this;
        this.pubSub.subscribe("new-comment", (topic, song) => {
            this.loadComments();
        });
    }

    loadComments() {
        this.commentsService.list(comments => {
            if (comments.length == 0) {
                this.setStatus('empty');
            } else {
                this.renderComments(comments);
                this.setStatus('ideal');
            }
        }, error => {
            this.setStatus('error');
            console.error("Error al cargar los comentarios", error);
        });
    }

    renderComments(comments) {
        let html = "";
        let self =this;
        /*for (let comment of comments) {
            html += this.renderComment(comment);
        }*/
        $.each(comments,function(index,comment){
            html += self.renderComment(comment);
        });
        this.setIdealHtml(html);
    }

    renderComment(comment) {
        return `<div class="comen">
                    <label>Realizado por: </label>
                    <p class="name-autor">${comment.name} ${comment.firstname}</p>
                    <label>Email de contacto: </label>
                    <p class="email">${comment.email}</p>
                    <label>Comentario: </label>
                    <p class="comentario">${comment.comment}</p>
                </div>`;
    }

}