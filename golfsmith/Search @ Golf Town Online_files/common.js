// JScript File
function initAjaxProgress()
{
    var pageHeight = (document.documentElement && document.documentElement.scrollHeight) ? document.documentElement.scrollHeight : (document.body.scrollHeight > document.body.offsetHeight) ? document.body.scrollHeight : document.body.offsetHeight;
    //SET HEIGHT OF BACKGROUND
    var bg = document.getElementById('ajaxProgressBg');
    bg.style.height = (pageHeight + 1000) + 'px';
    //POSITION THE PROGRESS INDICATOR ON INITIAL LOAD
    reposAjaxProgress();
    var width = new Date().getTime();
    while (new Date().getTime() < width+ 1500); 
    //REPOSITION THE PROGRESS INDICATOR ON SCROLL
    window.onscroll = reposAjaxProgress;
}

function reposAjaxProgress()
{
    var div = document.getElementById('ajaxProgress');
    var st = document.body.scrollTop;
    if (st == 0) {
        if (window.pageYOffset) st = window.pageYOffset;
        else st = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
    }
    div.style.top = 150 + st + "px";
}

function preorderDate(dateValue, spanElement) {

    var datePassed = new Date(dateValue);
    var currentDate = new Date();

    var diffDate = DaysBetween(datePassed, currentDate);

    if (diffDate < 0) {
	diffDate = diffDate * -1;
    }
    var dateString =  (datePassed.getMonth() + 1) + '-' + datePassed.getDate();

    var orderMsgDiv = document.getElementById(spanElement);
    orderMsgDiv.innerHTML = "";

    if (diffDate == 0) {
        orderMsgDiv.innerHTML += '<p>NOW AVAILABLE ONLINE &amp; IN STORE</p>';
        return 'Shop';
    } else if (diffDate == 1) {
        orderMsgDiv.innerHTML += '<p>PRE-ORDER NOW • AVAILABLE TOMORROW ONLINE &amp; IN STORE</p>';
        return 'Pre-order';
    } else if (diffDate > 1) {
        orderMsgDiv.innerHTML += '<p>PRE-ORDER NOW • AVAILABLE ' + dateString + ' ONLINE &amp; IN STORE</p>'; // NEED DATE HERE
        return 'Pre-order';
    } else {
        orderMsgDiv.innerHTML += '<p>AVAILABLE ONLINE &amp; IN STORE</p>';
        return 'Shop';
    }

}

function preorderDateFr(dateValue, spanElement) {
    var monthsInYear = new Array("Jan.", "F&egrave;v.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Ao&ugrave;t", "Sept.", "Oct.", "Nov.", "D&egrave;c.");
    var currentDate = new Date();
    var datePassed = new Date(dateValue);

    var diffDate = DaysBetween(datePassed, currentDate);

    if (diffDate < 0) {
        diffDate = diffDate * -1;
    }	

    //    var dateString = datePassed.getFullYear() + '-' + datePassed.getMonth() + '-' + datePassed.getDate();
    var dateString2 = (datePassed.getDate() == 1) ? "1er" : datePassed.getDate();
    var dateString = dateString2 + " " +  monthsInYear[datePassed.getMonth()] ;

    var orderMsgDiv = document.getElementById(spanElement);
    orderMsgDiv.innerHTML = "";

    if (diffDate == 0) {
        orderMsgDiv.innerHTML += '<p>En ligne et en magasin d&egrave;s maintenant !</p>';
        return 'Commandez';
    } else if (diffDate == 1) {
        orderMsgDiv.innerHTML += '<p>Pr&egrave;-commandez d&egrave;s maintenant • En ligne et magasin d&egrave;s demain</p>';
        return 'Pr&egrave;-commandez ';
    } else if (diffDate > 1) {
        orderMsgDiv.innerHTML += '<p>Pr&egrave;-commandez d&egrave;s maintenant • En ligne et en magasin d&egrave;s le  ' + dateString + '</p>'; // NEED DATE HERE
        return 'Pr&egrave;-commandez ';
    } else {
        orderMsgDiv.innerHTML += '<p>En ligne et en magasin d&egrave;s maintenant !</p>';
        return 'Commandez';
    }

}