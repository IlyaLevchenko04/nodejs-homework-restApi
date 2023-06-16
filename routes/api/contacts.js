const express = require('express');
const {
  getAllContacts,
  getOneContactById,
  postContact,
  deleteContact,
  putContactById,
  updateStatusFavoriteContact,
} = require('../../controllers/contactsRoutesFuncs');
const { auth } = require('../../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', getAllContacts);

router.get('/:id', getOneContactById);

router.post('/', postContact);

router.delete('/:contactId', deleteContact);

router.put('/:contactId', putContactById);

router.patch('/:contactId/favorite', updateStatusFavoriteContact);

module.exports = router;
