// Global Properties _________________________________________________________

var ELEMENT_LIST    = 'banda aceh,medan,padang,pekanbaru,jambi,palembang,bengkulu,bandar lampung,pangkal pinang,tanjung pinang,jakarta pusat,bandung,semarang,yogyakarta,surabaya,serang,denpasar,mataram,kupang,pontianak,palangkaraya,banjarmasin,samarinda,manado,palu,makassar,kendari,gorontalo,mamuju,ambon,sofifi,manokwari,jayapura',
    ONE_SECOND      = 1000,
    time_left       = 180000,
    elements        = ELEMENT_LIST.split(','),
    timer,
    intro,
    quiz,
    clock,
    input,
    remaining,
    start_button,
    solved,
    outro,
    replay;

// Global Methods ____________________________________________________________

function buildQuiz() {
    var intro_html  = '<div id="intro"><h2>Aturan Mainnya</h2><p>Setelah tekan tombol "Mulai!" soal akan dimulai.<br>Masukkan nama-nama ibu kota provinsi yang ada di Indonesia sebanyak yang kamu bisa dalam waktu 3 menit. Jawaban yang benar akan langsung di masukkan kedalam daftar ibu kota yang berhasil kamu jawab. Jadi tunjukin kalo kamu dulu pernah belajar geografi. &#94;&#94;</p></br><div style="color: white; text-align: center;">new &#9733;</div><div id="center">Kamu juga bisa posting total ibu kota yang berhasil dijawab lewat twitter!<br>Kita akan pasang 5 postingan twitter terbaru di footer bagi yang bisa menjawab semua nama-nama ibu kota!</div><button type="button" id="start_button" title="Klik untuk memulai">Mulai!</button></div>',
        quiz_html   = '<div id="quiz"><div id="clock">3:00</div><input id="input"><p><b id="remaining"></b> ibu kota lagi</p><ul id="solved" class="element_list"></ul></div>',
        outro_html  = '<div id="outro"><h2>Selesai!</h2><p>Kamu berhasil menjawab <strong id="named">0</strong> ibu kota Indonesia dalam 3 menit!</p><div id="share"><h2>Tunjukkan pada temanmu!</h2></div><p id="missed_message">Ini nama-nama ibu kota yang kelupaan:</p><ul id="missed_elements" class="element_list"></ul><button type="button" id="replay">Lagi?</button>',
        placeholder = $('#quiz_wrapper').append(intro_html, quiz_html, outro_html);

    intro           = $('#intro');
    quiz            = $('#quiz');
    clock           = $('#clock');
    input           = $('#input');
    remaining       = $('#remaining');
    start_button    = $('#start_button');
    solved          = $('#solved');
    outro           = $('#outro');
    replay_button   = $('#replay');

    start_button.click(startQuiz);
    replay_button.click(restart);
    input.keyup(function() {
        var val     = this.value,
            els     = elements,
            index   = $.inArray(val, els);

        if (index !== -1) {
            els.splice(index, 1);
            solved.append('<li>' + val + '</li>');
            this.value = '';

            update();
        }
    });

    update();
}

function startQuiz() {
    intro.hide();
    quiz.show();
    input.focus();

    trackEvent('Start');

    timer = setInterval(tick, ONE_SECOND);
}

function restart() {
    trackEvent('Restart');
    window.location = '';
}

function stopQuiz() {
	var solved_elements = solved.children().length;
	var share_bypoint = "";
	if (solved_elements < 33) {
		share_bypoint = 'Cuman ' + solved_elements + ' ibu kota yang berhasil kejawab! #IbuKotaKita http://pic.twitter.com/uURugLP3';
	}
	else {
		solved_elements = 'Lengkap ' + solved_elements + ' ibu kota yang berhasil kejawab! #IbuKotaKita http://pic.twitter.com/uURugLP3';
	}
    var share_text      = share_bypoint,
        missed_list     = $('#missed_elements'),
        share_box       = $('#share'),
        twitter_html    = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.hariawan.com/ibukotakita/" data-text="' + share_text + '" data-count="vertical">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script>',
        plus_html       = '<div class="g-plusone" data-size="tall" data-href="http://www.hariawan.com/ibukotakita/index.html"></div><script type="text/javascript">(function() {var po = document.createElement(\'script\'); po.type = \'text/javascript\'; po.async = true;po.src = \'https://apis.google.com/js/plusone.js\';var s = document.getElementsByTagName(\'script\')[0]; s.parentNode.insertBefore(po, s);})();</script>',
        facebook_html   = '<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.hariawan.com%2Fibukotakita%2Findex.html&amp;send=false&amp;layout=box_count&amp;width=50&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=lucida+grande&amp;height=90&amp;appId=251751164868646" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:50px; height:90px;" allowTransparency="true"></iframe>';

    clearInterval(timer);

    trackEvent('Stop');

    share_box.append(twitter_html, plus_html, facebook_html);
    share_box.children(':not(h2)').wrap('<div class="share_item">');
    quiz.hide();
    outro.show();

    $('#named').text(solved_elements);

    if (elements.length > 0) {
        $.each(elements, function() {
            missed_list.append('<li>' + this + '</li>');
        });
    }
    else {
        $('#missed_message, missed_elements').hide();
    }

    trackScore(solved_elements);
}

function formatTime(ms) {
    var x,
        seconds,
        minutes,
        formatted_time,
        number;

    x       = ms / 1000;
    seconds = x % 60;
    x       /= 60;
    minutes = Math.floor(x % 60);

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (minutes < 1 && !clock.hasClass('warning')) {
        clock.addClass('warning')
    }

    formatted_time = [minutes, seconds].join(':');

    return formatted_time;
}

function tick() {
    time_left -= ONE_SECOND;
    clock.text(formatTime(time_left));

    if (time_left <= 0) {
        stopQuiz();
    }
}

function update() {
    var count = elements.length;

    remaining.text(count);

    if (count <= 0) {
        stopQuiz();
    }
}

function trackEvent(event_type) {
    if (_gaq) {
        _gaq.push(['_trackEvent', 'Quiz', event_type]);
    }
}

function trackScore(score) {
    if (_gaq) {
        _gaq.push(['_trackEvent', 'Score', 'Points', score]);
    }
}

// Initialization ____________________________________________________________

$(document).ready(function() {
    buildQuiz();
});