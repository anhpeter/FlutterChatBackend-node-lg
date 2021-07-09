const express = require('express');
const Helper = require('../app/defines/Helper');
const ErrorMessage = require('../app/defines/Messages/ErrorMessage');
const MyResponse = require('../app/defines/MyResponse');
const MyTime = require('../app/defines/MyTime');
const router = express.Router();
const MainModel = require('../app/models/chat');

// GET =======================
router.get('/all', (req, res) => {
    MainModel.listAll((err, result) => {
        res.json(result)
    })
})

router.post('/getChatInfoByUserIdsOrCreateIfNotExist', (req, res) => {
    const { ids } = req.body;
    MainModel.findInfoByUserIdsOrCreateIfNotExist(ids)
        .then(result => {
            if (result)
                MyResponse.success(res, docs);
            else
                MyResponse.fail(res);
        }).catch(err => {
            MyResponse.error(res, err);
        });
})

router.post('/getChatByMemberIds', (req, res) => {
    const { ids } = req.body;
    MainModel.findByMemberIds(ids)
        .then(result => {
            if (result)
                MyResponse.success(res, docs);
            else
                MyResponse.fail(res);
        }).catch(err => {
            MyResponse.error(res, err);
        });
})

router.get('/getChatById', (req, res) => {
    const { id } = req.query;
    MainModel.findById(id)
        .then(result => {
            if (result)
                MyResponse.success(res, docs);
            else
                MyResponse.fail(res);
        }).catch(err => {
            MyResponse.error(res, err);
        });
})


router.get('/reset', (req, res) => {
    MainModel.reset((err, result) => {
        res.json(result)
    })
})

router.get('/listChatForListDisplay', (req, res) => {
    const { id } = req.query;
    MainModel.listItemsForListDisplay(id)
        .then(docs => {
            if (docs.length > 0)
                MyResponse.success(res, docs);
            else
                MyResponse.fail(res);
        }).catch(err => {
            MyResponse.error(res, err);
        });
})

router.get('/getSidebarConversationById', (req, res) => {
    const { id } = req.query;
    MainModel.findSidebarItemById(id)
        .then(result => {
            if (result)
                MyResponse.success(res, docs);
            else
                MyResponse.fail(res);
        }).catch(err => {
            MyResponse.error(res, err);
        });
})

router.post('/createConversationWithMemberIds', (req, res) => {
    const { ids, messageParams } = req.body;
    let firstMessage = null;
    if (messageParams) {
        const { user, message } = messageParams;
        firstMessage = {
            from: user,
            text: message,
            time: MyTime.getUTCNow(),
        }
    }
    MainModel.createConversationByMemberIds(ids, firstMessage)
        .then(result => {
            if (result)
                MyResponse.success(res, docs);
            else
                MyResponse.fail(res);
        }).catch(err => {
            MyResponse.error(res, err);
        });
})

module.exports = router;