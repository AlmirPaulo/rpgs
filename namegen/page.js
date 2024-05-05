let generator = null;

const clear = () => {
    $('#output').empty();
}

const fill = () => {
    const $output = $('#output');
    const $w = $(window);
    const $b = $('body');
    while (generator && $w.scrollTop() + $w.height() > $b.height()) {
        $output.append($('<li>' + generator + '</li>'));
    }
}

const group = (n) => {
    const string = n.toString();
    if (/^\d+$/.test(string)) {
        return string
            .split('')
            .reverse()
            .join('')
            .split(/(\d\d\d)/)
            .filter(s => s !== '')
            .map(s => s.split('').reverse().join(''))
            .reverse()
            .join(',');
    } else {
        return string;
    }
}

const update = (event) => {
    if (event) event.preventDefault();
    clear();
    try {
        const spec = $('#spec').val();
        generator = NameGen.compile(spec);
        location.replace('#' + encodeURI(spec));
        $('#spec').removeClass('invalid');
        if (generator.max() === 0) {
            generator = null;
            $('#count').text('');
        } else {
            const count = group(generator.combinations());
            const possibilitiesText = count === 1 ? ' possibility' : ' possibilities';
            $('#count').text(count + possibilitiesText);
        }
        fill();
    } catch (e) {
        $('#spec').addClass('invalid');
        $('#count').text('invalid');
    }
}

$(document).ready(() => {
    $('#input').on('submit input change', update);
    $(window).on('scroll', fill);
    $('#help').on('click', (event) => {
        event.preventDefault();
        $('#reference').slideToggle();
    });
    if (location.hash) {
        $('#spec').val(decodeURI(location.hash.substring(1)));
        update();
    }
});

