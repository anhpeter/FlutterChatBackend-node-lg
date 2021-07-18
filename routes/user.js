const express = require('express');
const Helper = require('../app/defines/Helper');
const ErrorMessage = require('../app/defines/Messages/ErrorMessage');
const MyResponse = require('../app/defines/MyResponse');
const router = express.Router();
const MainModel = require('../app/models/user');

// GET =======================
router.get('/all', async(req, res) => {
    MainModel.listAll().then(result => {
        res.json(result);
    }).catch(err => {
        MyResponse.error(res, err);
    });
});

router.get('/listUserWithParams', async(req, res) => {
    MainModel.listUserWithParams(req.query).then(result => {
        res.json(result);
    }).catch(err => {
        MyResponse.error(res, err);
    });
});

router.post('/getUsersByIds', (req, res, next) => {
    const { ids } = req.body;
    MainModel.findUsersByIds(ids)
        .then(docs => {
            MyResponse.success(res, docs);
        }).catch(err => {
            MyResponse.error(res, err);
        });
});

router.post('/getUserByUsernameAndPassword', (req, res, next) => {
    const { username, password } = req.body;
    MainModel.findByUsernameAndPassword(username, password)
        .then(doc => {
            MyResponse.success(res, docs);
        }).catch(err => {
            MyResponse.error(res, err);
        });
});

router.get('/getUserByUid', (req, res, next) => {
    const {uid} = req.query;
    MainModel.findByUid(uid)
        .then(doc => {
            MyResponse.success(res, doc);
        }).catch(err => {
            MyResponse.error(res, err);
        });
});

router.get('/getUserByUsername', (req, res, next) => {
    const { username } = req.query;
    MainModel.findByUsername(username)
        .then(doc => {
            MyResponse.success(res, docs);
        }).catch(err => {
            MyResponse.error(res, err);
        });
});

router.post('/getReceivers', (req, res, next) => {
    let { username, exceptIds = [] } = req.body;
    exceptIds = exceptIds || [];
    MainModel.findReceivers(username, exceptIds)
        .then(docs => {
            MyResponse.success(res, docs);
        }).catch(err => {
            MyResponse.error(res, err);
        });
});

// CREATE
router.post('/createNewUser', (req, res, next) => {
    const { username, email, password, uid } = req.body;
    MainModel.createNewAccount({ username, email, password, uid })
        .then(doc => {
            MyResponse.success(res, doc);
        }).catch(err => {
            MyResponse.error(res, err);
        });
});

router.post('/getOrCreateUserIfNotExist', (req, res, next) => {
    MainModel.getOrCreateUserIfNotExist(req.body)
        .then(doc => {
            MyResponse.success(res, doc);
        }).catch(err => {
            console.log(err);
            MyResponse.error(res, err);
        });
});

// RUN ACTION
router.get('/runAction', (req, res) => {});

// RESET 
router.get('/reset', (req, res) => {
    MainModel.reset(req.admin)
        .then(result => {
            MyResponse.success(res, result);
        }).catch(err => {
            console.log(err);
            MyResponse.error(res, err);
        });
});

module.exports = router;

// FRIEND ACTIONS
//router.post('/unfriend', (req, res) => {
//const { id, friendId } = req.body;
//Helper.runIfParamsNotNull(res, () => {
//MainModel.unfriendById(id, friendId, (err, result) => {
//if (err)
//MyResponse.error(res, err);
//else
//if (result)
//MyResponse.success(res, result);
//else
//MyResponse.fail(res);
//});
//}, id, friendId)
//})
//router.post('/sentFriendRequest', (req, res) => {
//const { id, friendId } = req.body;
//Helper.runIfParamsNotNull(res, () => {
//MainModel.sentFriendRequestById(id, friendId, (err, result) => {
//if (err)
//MyResponse.error(res, err);
//else
//if (result)
//MyResponse.success(res, result);
//else
//MyResponse.fail(res);
//});
//}, id, friendId)
//})

//router.post('/confirmFriendRequest', (req, res) => {
//const { id, friendId } = req.body;
//Helper.runIfParamsNotNull(res, () => {
//MainModel.confirmFriendRequest(id, friendId, (err, result) => {
//if (err) {
//MyResponse.error(res, err);
//} else
//if (result)
//MyResponse.success(res, result);
//else
//MyResponse.fail(res);
//});
//}, id, friendId)
//})
//router.post('/cancelFriendRequest', (req, res) => {
//const { id, friendId } = req.body;
//Helper.runIfParamsNotNull(res, () => {
//MainModel.cancelFriendRequest(id, friendId, (err, result) => {
//if (err) {
//MyResponse.error(res, err);
//} else
//if (result)
//MyResponse.success(res, result);
//else
//MyResponse.fail(res);
//});
//}, id, friendId)
//})

//router.post('/deleteFriendRequest', (req, res) => {
//const { id, friendId } = req.body;
//Helper.runIfParamsNotNull(res, () => {
//MainModel.deleteFriendRequest(id, friendId, (err, result) => {
//if (err) {
//MyResponse.error(res, err);
//} else
//if (result)
//MyResponse.success(res, result);
//else
//MyResponse.fail(res);
//});
//}, id, friendId)
//})
//router.post('/cancelFriendRequest', (req, res) => {
//const { id, friendId } = req.body;
//Helper.runIfParamsNotNull(res, () => {
//MainModel.cancelFriendRequest(id, friendId, (err, result) => {
//if (err) {
//MyResponse.error(res, err);
//} else
//if (result)
//MyResponse.success(res, result);
//else
//MyResponse.fail(res);
//});
//}, id, friendId)
//})

//router.get('/getFriendsByUsername', (req, res, next) => {
//const { username } = req.query;

//MainModel.findFriendsByUsername(username)
//.then(docs => {
//if (docs.length > 0)
//MyResponse.success(res, docs);
//else
//MyResponse.fail(res);
//}).catch(err => {
//MyResponse.error(res, err);
//});
//})

//router.get('/getStrangerByUsername', (req, res, next) => {
//const { username } = req.query;
//MainModel.findStrangerByUsername(username)
//.then(docs => {
//if (docs.length)
//MyResponse.success(res, docs);
//else
//MyResponse.fail(res);
//}).catch(err => {
//MyResponse.error(res, err);
//});
//})

//router.get('/getSentRequestFriendById', (req, res, next) => {
//const { id } = req.query;
//MainModel.findSentRequestFriendById(id)
//.then(docs => {
//if (docs.length)
//MyResponse.success(res, docs);
//else
//MyResponse.fail(res);
//}).catch(err => {
//MyResponse.error(res, err);
//});
//})