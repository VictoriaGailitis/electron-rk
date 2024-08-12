const express = require('express');
const app = express();
const port = 60838;
const fs = require('fs')
const path = require('path');


app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})


app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended:true}))


const hbs = require('hbs');
app.set('views', `${__dirname}/views`);
app.set('view engine', 'hbs');

const imp = require('./main.js')
let filePathCategories, filePathField, filePathGames
if (imp.prod == true){
    filePathCategories = path.join(__dirname, '..', 'db', 'categories.db')
    filePathField = path.join(__dirname, '..', 'db', 'field.db')
    filePathGames = path.join(__dirname, '..', 'db', 'played_games.db')
}
else {
    filePathCategories = `${__dirname}/db/categories.db`
    filePathField = `${__dirname}/db/field.db`
    filePathGames = `${__dirname}/db/played_games.db`
}

let Datastore = require('nedb')
let categories = new Datastore({ filename: filePathCategories, autoload: true })
let field = new Datastore({ filename: filePathField, autoload: true })
let played_games = new Datastore({ filename: filePathGames, autoload: true })


Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('random', function(arg) {
    return Math.floor(Math.random() * (arg - 1) + 1);
});

hbs.registerHelper("repeat", function (times, opts) {
    var out = "";
    var i;
    var data = {};
    if ( times ) {
        for ( i = 0; i < times; i += 1 ) {
            data.index = i;
            out += opts.fn(this, {
                data: data
            });
        }
    } else {
        out = opts.inverse(this);
    }
    return out;
});


function randomFloor(num) {
    return Math.floor(Math.random() * (num - 1) + 1);
}

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}


app.get('/', function(req,res) {
    field.find().exec(function(err, doc) {
        if (doc.length == 0) {
            res.render('new')
        }
        else {
            res.redirect('field')
        }
    })
})

app.get('/newGame', function(req,res) {
    field.remove({}, { multi: true }, function (err, numRemoved) {}) 
    categories.find().exec(function(err, doc) {
        for (let i = 0; i < doc[0].chosen.length; i++) {
            doc[0].free.push(doc[0].chosen[i])
        }
        categories.update({"flag": 1}, {$set: {"free": doc[0].free}}, {multi: false, upsert: false}, function () {})
        categories.update({"flag": 1}, {$set: {"chosen": []}}, {multi: false, upsert: false}, function () {})
    })
    played_games.remove({}, { multi: true }, function (err, numRemoved) {})
    played_games.insert({"games": []})
    res.redirect('/')
})

app.post('/', function(req,res) {
    let rows = req.body.rows
    let cols = req.body.cols
    let hidden = req.body.hidden
    let open = Number(rows) * Number (cols) - Number(hidden)
    let golden = req.body.golden
    let white = Number(rows) * Number (cols) - Number(golden)
    let heartsNum = Number(req.body.hearts)
    if (Number(hidden) > Number(rows) * Number (cols)) {
        return res.render('new', {error: "Количество закрытых клеток не может быть больше " 
        + String(Number(rows) * Number (cols)) + "!"})
    }
    if (Number(golden) > Number(rows) * Number (cols)) {
        return res.render('new', {error: "Количество золотых клеток не может быть больше " 
        + String(Number(rows) * Number (cols)) + "!"})
    }
    let hearts = []
    for (let i = 0; i < heartsNum; i++) {
        hearts.push(`heart-${randomFloor(8)}.png`)
    }
    field.insert({"flag":1, "hearts": hearts, "rows": rows, "cols": cols, "hidden": hidden,
                    "open": open, "white": white, "golden": golden, "cards": 0})
    
    let types = []
    let colors = []
    for (let i = 0; i < hidden; i++)
        types.push('hidden')
    for (let i = 0; i < open; i++)
        types.push('open')
    for (let i = 0; i < white; i++)
        colors.push('white')
    for (let i = 0; i < golden; i++)
        colors.push('yellow')
    categories.findOne({}).exec(function(err, doc) {
        let res1 = getRandomSubarray((doc.free), Number(rows) * Number(cols))
        let res2 = []
        for (let i = 0; i < res1.length; i++) {
            let obj = {"category": res1[i], "type": types.splice(Math.floor(Math.random() * types.length), 1)[0],
                "color": colors.splice(Math.floor(Math.random() * colors.length), 1)[0], "crossed": 0,
                "hiddenBackground": `hidden-${randomFloor(5)}.png`, "crossedBackground": `line-${randomFloor(5)}.png`,
                "whiteBackground": `border-${randomFloor(5)}-white.png`, "yellowBackground": `border-${randomFloor(5)}-yellow.png`,
                "descr": "", "id": i}
            if (obj.color == "white") {
                obj.currentBackground = obj.whiteBackground
            }
            else {
                obj.currentBackground = obj.yellowBackground
            }
            res2.push(obj)
        }
        categories.update({"flag": 1}, {$pull: {"free": {$in: res1}}}, {multi: false, upsert: false}, function () {})
        categories.update({"flag": 1}, {$set: {"chosen": res1}}, {multi: false, upsert: false}, function () {})
        field.update({"rows": rows}, { $set: { "cards":  res2} }
                        , {multi: false, upsert: false}, function () {})
        res.redirect('field')
    })
})

app.get('/field', function(req,res) {
    field.findOne({}).exec(function(err, field) {
        res.render('field', {args: field})
    })
})

app.get('/changeColor', function(req,res) {
    id = req.query.id
    field.findOne({flag: 1}).exec(function(err, result) {
        let cardArr = result.cards
        if (cardArr[id].color == "white") {
            cardArr[id].color = "yellow"
            cardArr[id].currentBackground = cardArr[id].yellowBackground
        }
        else {
            cardArr[id].color = "white"
            cardArr[id].currentBackground = cardArr[id].whiteBackground
        }
        field.update({"flag": 1}, { $set: { "cards": cardArr} }
                        , {multi: false, upsert: false}, function () {})
        });
    res.redirect('field')
})

app.get('/changeCross', function(req,res) {
    let id = req.query.id
    field.findOne({}).exec(function(err, result) {
        if (result.cards[id].crossed == 0) {
            result.cards[id].crossed = 1 }
        else {
            result.cards[id].crossed = 0
        }
        field.remove({}, { multi: true }, function (err, numRemoved) {
        });
        field.insert(result)
    })
    res.redirect('field')
})

app.get('/changeOpen', function(req,res) {
    let id = req.query.id
    field.findOne({}).exec(function(err, result) {
        if (result.cards[id].type == "open") {
            result.cards[id].type = "hidden"
            let this_category = result.cards[id].category
            categories.findOne({}).exec(function(err, cat) {
                cat.chosen.splice(cat.chosen.indexOf(this_category), 1) //убирается старая тема из выбранных
                result.cards[id].category = getRandomSubarray(cat.free, 1)[0] //рандомится из свободных
                cat.free.splice(cat.free.indexOf(result.cards[id].category), 1) //удаляетя новая тема из свободных
                cat.chosen.push(result.cards[id].category) //новая тема заносится в занятые
                cat.free.push(this_category) //старая тема уходит в свободные
                categories.remove({}, { multi: true }, function (err, numRemoved) {
                });
                categories.insert(cat)             
            })
        }
        else {
            result.cards[id].type = "open"
        }
        field.remove({}, { multi: true }, function (err, numRemoved) {
        });
        field.insert(result)
    })
    res.redirect('field')
})

app.post('/makeDescription', function(req,res) {
    let id = req.body.cardId;
    let descr = req.body.description
    field.findOne({}).exec(function(err, result) {
        result.cards[id].descr = descr
        field.remove({}, { multi: true }, function (err, numRemoved) {
        });
        field.insert(result)
    })
    res.redirect('field')
})

app.get('/changeTheme', function(req,res) {
    let id = req.query.id
    field.findOne({}).exec(function(err, result) {
        let this_category = result.cards[id].category
        categories.findOne({}).exec(function(err, cat) {
            cat.chosen.splice(cat.chosen.indexOf(this_category), 1) //убирается старая тема из выбранных
            result.cards[id].category = getRandomSubarray(cat.free, 1)[0] //рандомится из свободных
            cat.free.splice(cat.free.indexOf(result.cards[id].category), 1) //удаляетя новая тема из свободных
            cat.chosen.push(result.cards[id].category) //новая тема заносится в занятые
            cat.free.push(this_category) //старая тема уходит в свободные
            categories.remove({}, { multi: true }, function (err, numRemoved) {
            });
            categories.insert(cat)             
        })
        field.remove({}, { multi: true }, function (err, numRemoved) {
        });
        field.insert(result)
    })
    res.redirect('field')
})

app.get('/changeList', function(req,res) {
    categories.findOne({}).exec(function(err, result) {
        res.render('list', {list: result.free, count: result.free.length})
    })
})

app.post('/newTheme', function(req,res) {
    let themeName = req.body.newThemeName;
    categories.findOne({}).exec(function(err, result) {
        result.free.push(themeName)
        categories.remove({}, { multi: true }, function (err, numRemoved) {
        });
        categories.insert(result)
    })
    res.redirect(`changeList`)
})


app.post('/editList', function(req,res) {
    let buttonValue = req.body.btnRes;
    let themeName = req.body.themeName;
    if (buttonValue == "DELETE") {
        categories.findOne({}).exec(function(err, result) {
            result.free = result.free.filter(item => item !== themeName)
            categories.remove({}, { multi: true }, function (err, numRemoved) {
            });
            categories.insert(result)
        })
    }
    else if (buttonValue == "CHANGE") {
        categories.findOne({}).exec(function(err, result) {
            let elemIndex = req.body.elemID;
            result.free[Number(elemIndex)] = themeName
            categories.remove({}, { multi: true }, function (err, numRemoved) {
            });
            categories.insert(result)
        })
    }
    res.redirect(`changeList`)
})

app.get('/plusHeart', function(req,res) {
    field.findOne({}).exec(function(err, result) {
        let newHearts = result.hearts
        newHearts.push(`heart-${randomFloor(8)}.png`)
        field.update({"flag": 1}, { $set: { "hearts":  newHearts} }
                        , {multi: false, upsert: false}, function () {})
    })
    res.redirect('field')
})

app.get('/minusHeart', function(req,res) {
    field.findOne({}).exec(function(err, result) {
        if (result.hearts.length > 0) {
            let newHearts = result.hearts
            newHearts.pop()
            field.update({"flag": 1}, { $set: { "hearts":  newHearts} }
                        , {multi: false, upsert: false}, function () {})
        }
    })
    res.redirect('field')
})

app.get('/gamesList', function(req,res) {
    played_games.findOne({}).exec(function(err, result) {
        res.render('games', {list: result.games, count: result.games.length})
    })
})

app.post('/addGame', function(req,res) {
    let gameName = req.body.gameName;
    let completed = req.body.completed;
    played_games.findOne({}).exec(function(err, result) {
        result.games.push({"name": gameName, "completed": completed})
        played_games.remove({}, { multi: true }, function (err, numRemoved) {
        });
        played_games.insert(result)
    })
    res.redirect('gamesList')
})

app.post('/editGames', function(req,res) {
    let buttonValue = req.body.btnRes;
    let gameName = req.body.gameName;
    let elemIndex = req.body.elemID;
    let complete = req.body.complete;
    if (buttonValue == "DELETE") {
        played_games.findOne({}).exec(function(err, result) {
            result.games = result.games.filter(function (el) {
                return el.name != gameName; 
            })
            played_games.remove({}, { multi: true }, function (err, numRemoved) {
            });
            played_games.insert(result)
        })
    }
    else if (buttonValue == "CHANGE") {
        played_games.findOne({}).exec(function(err, result) {
            result.games[Number(elemIndex)].name = gameName
            result.games[Number(elemIndex)].completed = complete
            played_games.remove({}, { multi: true }, function (err, numRemoved) {
            });
            played_games.insert(result)
        })
    }
    res.redirect('gamesList')
})

app.get('/changeNotepadList', function(req,res) {
    categories.findOne({}).exec(function(err, result) {
        res.render('notepadList', {list: result.free, count: result.free.length})
    })
})

app.post('/editNotepadList', function(req,res) {
    let list = req.body.notepad;
    categories.findOne({}).exec(function(err, result) {
        result.free = list.trim().split("\r\n")
        categories.remove({}, { multi: true }, function (err, numRemoved) {});
        categories.insert(result)
    })
    res.redirect(`changeNotepadList`)
})