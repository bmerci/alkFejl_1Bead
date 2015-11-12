var express = require('express');

var router = express.Router();

//Viewmodel réteg
var statusTexts = {
    'new': 'Új',
    'assigned': 'Hozzárendelve',
    'ready': 'Kész',
    'rejected': 'Elutasítva',
    'pending': 'Felfüggesztve',
};
var statusClasses = {
    'new': 'danger',
    'assigned': 'info',
    'ready': 'success',
    'rejected': 'default',
    'pending': 'warning',
};
function decorateGroups(groupContainer) {
    return groupContainer.map(function (e) {
        //e.statusText = statusTexts[e.status];
        //e.statusClass = statusClasses[e.status];
        return e;
    });
}

router.get('/list', function (req, res) {
    req.app.models.group.find().then(function (groups) {
        console.log(groups);

        //megjelenítés
        res.render('groups/list', {
            groups: decorateGroups(groups),
            messages: req.flash('info')
        });
    });
});
router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('groups/new', {
        validationErrors: validationErrors,
        data: data,
    });
});
router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('csapatNev', 'Hibás csapatnév').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('elsoJatekosNeve', 'Hibás játékos név').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('masodikJatekosNeve', 'Hibás játékos név').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    console.log(req.body);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/groups/new');
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        req.app.models.group.create({
            name: req.body.csapatNev,
            firstMemberName: req.body.elsoJatekosNeve,
            secondMemberName: req.body.masodikJatekosNeve
        })
        .then(function (error) {
            //siker
            req.flash('info', 'Csoport sikeresen felvéve!');
            res.redirect('/groups/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });
    }
});
router.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    req.app.models.group.destroy({id: id})
        .then(function (deletedGroups) {
            res.format({
                'text/html': function() {
                    res.redirect('/groups/list');
                }
            });
        });
});

module.exports = router;