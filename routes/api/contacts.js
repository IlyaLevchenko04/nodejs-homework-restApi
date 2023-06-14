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

router.get('/', getAllContacts);

router.get('/:id', getOneContactById);

router.post('/', postContact);

router.delete('/:contactId', deleteContact);

router.put('/:contactId', putContactById);

router.patch('/:contactId/favorite', updateStatusFavoriteContact);

module.exports = router;
