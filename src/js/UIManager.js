const $ = require("jquery");

export default class UIManager {
    
    constructor(selector) {
        this.uiStateClasses = "empty loading error partial ideal"; // clases CSS que definen estados de componente
        this.element = $(selector); // seleccionamos el elemento de jQuery en el constructor
    }

    setStatus(status) {
        this.element.removeClass(this.uiStateClasses).addClass(status);
    }

    setErrorHtml(html) {
        this.element.find(".form-status .error-message").html(html);
    }


    setIdealHtml(html) {
        this.element.find(".ui-status.ideal .commentslist").html(html);
    }

}