const express = require('express');
const {
  getAllContacts,
  getOneContactById,
  postContact,
  deleteContact,
  putContactById,
  updateStatusFavoriteContact,
} = require('../../controllers/contactsRoutesFuncs');

const router = express.Router();

router.get('/', getAllContacts(req, res, next));

router.get('/:id', getOneContactById(req, res, next));

router.post('/', postContact(req, res, next));

router.delete('/:contactId', deleteContact(req, res, next));

router.put('/:contactId', putContactById(req, res, next));

router.patch(
  '/:contactId/favorite',
  updateStatusFavoriteContact(req, res, next)
);

module.exports = router;
