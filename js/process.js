function makeId(str) {
    return 'kn_id_' + str.toLowerCase().replace(' ', '-');
}

function linkify(str) {
    var result = '';
    var lastIdx = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] == '[') {
            result += str.slice(lastIdx, i);
            i++;
            var linkIdx = i;
            while (str[i] != ']') {
                i++;
            }
            var linkingText = str.slice(linkIdx, i);
            var idName = makeId(linkingText);
            result += `<a href="#${idName}">${linkingText}</a>`;
            lastIdx = i + 1;
        }
    }
    result += str.slice(lastIdx, i)
    return result;
};

var rawData;

function processData(data) {
    var html = '';
    for (element of data.data) {
        if (element.kn.length == 0) continue;
        var idName = makeId(element.kn);
        if ('searchedInMeaning' in element && element.searchedInMeaning) {
            html += `<div id=${idName} class="kn fade">`;
        } else {
            html += `<div id=${idName} class="kn">`;
        }
        html += `<h2><a href="#${idName}">${element.kn}</a></h2>`;
        for (p of element.meaning) {
            html += `<p>${linkify(p)}</p>`;
        }
        html += `<div class="example">`;
        for (p of element.example) {
            html += `<p>${linkify(p)}</p>`;
        }
        html += `</div></div>`;
    }
    document.getElementById('filecontent').innerHTML = html;
};

var jsonURL = 'https://officialcommentsleague.github.io/data/data.json';
if (testing) {
    jsonURL = 'http://localhost:8080/data/data.json';
}

fetch(jsonURL, { cache: 'no-store' })
    .then(response => response.json())
    .then(data => {
        rawData = data;
        processData(rawData);
    });

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

document.getElementById("search").addEventListener('input', function(evt) {
    var input = this.value.trim();
    if (input.length == 0) { return processData(rawData); }
    var data = { data: [] };
    var pushed = [];
    for (var i = 0; i < rawData.data.length; i++) {
        if (rawData.data[i].kn.toLowerCase().includes(input.toLowerCase())) {
            data.data.push(copy(rawData.data[i]));
            pushed.push(i);
        }
    }
    for (var i = 0; i < rawData.data.length; i++) {
        if (pushed.includes(i)) continue;
        for (meaning of rawData.data[i].meaning) {
            if (meaning.toLowerCase().includes(input.toLowerCase())) {
                data.data.push(copy(rawData.data[i]));
                data.data[data.data.length - 1].searchedInMeaning = true;
                pushed.push(i);
                break;
            }
        }
    }
    processData(data);
});