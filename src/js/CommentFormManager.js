const $ = require("jquery");

import UIManager from './UIManager';

export default class CommentFormManager extends UIManager {

    constructor(elementSelector, commentsService, pubSub) {
        super(elementSelector);
        this.commentsService = commentsService;
        this.pubSub = pubSub;
    }

    init() {
        this.setupSubmitEventHandler();
    }

    setupSubmitEventHandler() {
        this.element.on("submit", (event) => {
            this.validateAndSendData();
            return false;
        });
    }

    validateAndSendData() {
        if (this.isValid()) {
            this.send();
        }
    }

    isValid() {
        const inputs = this.element.find("input");
        let allerrorMessage='';
        let errors=false;
        //for (let input of inputs) {
        $.each(inputs,function(index,input){
            if (input.checkValidity() == false) {
                errors=true;
                const errorMessage = input.validationMessage;
                input.focus();
                let field = input.previousElementSibling.innerHTML;
                allerrorMessage +=`"${field}": ${errorMessage}</br>`;
            
            }
        });
        //}
        

        let textareaFiels = this.element.find("textarea");
        const textareaLenght = textareaFiels[0].value.trim().split(" ").length;
        console.log(textareaFiels);
        if (textareaLenght > 120) {
            errors=true;
            allerrorMessage +="El comentario no puede tener mas de 120 palabras</br>";
        }
        if (textareaFiels[0].value.length == 0) {
            errors=true;
            allerrorMessage +="El comentario no puede estar vacío</br>";
        }
        console.log(errors);
        if (errors){
            this.setErrorHtml(allerrorMessage);
            this.setStatus('error');
            console.log('errores');
            return false;
        }

        this.setStatus('ideal'); 
        return true;
    }

    send() {
        this.disableFormControls();
        this.setStatus('loading');
        const comment = {
            article: this.element.find("#idarticle").val(),
            name: this.element.find("#name").val(),
            firstname: this.element.find("#firstname").val(),
            email:this.element.find("#email").val(),
            comment: this.element.find("#comment").val()
        };
        this.commentsService.save(comment, success => {
            this.pubSub.publish("new-comment", comment);
            this.resetForm();
            this.setStatus('ideal');
        }, error => {
            this.setErrorHtml("Se ha producido un error al guardar la canción en el servidor.");
            this.setStatus('error');
        });
        this.enableFormControls();
    }

    resetForm() {
        this.element[0].reset();
    }

    disableFormControls() {
        this.element.find("input, button").attr("disabled", true);
    }

    enableFormControls() {
        this.element.find("input, button").attr("disabled", false);
    }

}