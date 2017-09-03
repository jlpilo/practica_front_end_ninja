const $ = require("jquery");

export default class CommentsService {

    constructor(url) {
        this.url = url;
    }

    list(successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            success: successCallback,
            error: errorCallback
        });
    }

    save(comment, successCallback, errorCallback) {
        $.ajax({
            url: this.url,
            method: "post",
            data: comment,
            success: successCallback,
            error: errorCallback
        })
    }

    getDetail(commentId, successCallback, errorCallback) {
        $.ajax({
            url: `${this.url}${commentId}`,
            success: successCallback,
            error: errorCallback
        })
    }
}