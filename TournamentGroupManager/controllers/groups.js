var express = require('express');

var router = express.Router();

router.get('/list', function (req, res) {
    req.app.models.group.find().then(function (groups) {
        console.log(groups);
        
        res.render('groups/list', {
            groups: groups,
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
    req.checkBody('csapatNev', 'Hibás csapatnév').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('elsoJatekosNeve', 'Hibás játékos név').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('masodikJatekosNeve', 'Hibás játékos név').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    console.log(req.body);
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/groups/new');
    }
    else {
        req.app.models.group.create({
            name: req.body.csapatNev,
            firstMemberName: req.body.elsoJatekosNeve,
            secondMemberName: req.body.masodikJatekosNeve
        })
        .then(function (error) {
            req.flash('info', 'Csoport sikeresen felvéve!');
            res.redirect('/groups/list');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
});

router.get('/edit/:id', function(req, res) {
   var id = req.params.id;
   var groupToEdit = req.app.models.group.findOneById(id)
        .then(function (groupToEdit) {
            console.log(groupToEdit);
            //res.body = ;
            res.render('groups/new', {
                data: {
                   csapatNev: groupToEdit.name,
                   elsoJatekosNeve: groupToEdit.firstMemberName,
                   masodikJatekosNeve: groupToEdit.secondMemberName
                }
            });
        });
});

router.post('/edit/:id', function (req, res) {
    var id = req.params.id;
    
    req.checkBody('csapatNev', 'Hibás csapatnév').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('elsoJatekosNeve', 'Hibás játékos név').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('masodikJatekosNeve', 'Hibás játékos név').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    console.log(req.body);
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/groups/edit/' + id);
    }
    else {
        req.app.models.group.update(id, {
            name: req.body.csapatNev,
            firstMemberName: req.body.elsoJatekosNeve,
            secondMemberName: req.body.masodikJatekosNeve
        })
        .then(function (error) {
            req.flash('info', 'Csoport sikeresen módosítva!');
            res.redirect('/groups/list');
        })
        .catch(function (err) {
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