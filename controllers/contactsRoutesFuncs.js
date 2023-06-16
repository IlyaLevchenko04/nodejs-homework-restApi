const { contactsAddSchema } = require('../schemas/joiSchema');
const contactsFunc = require('../models/contacts');

async function getAllContacts(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const result = await contactsFunc.listContacts(owner);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getOneContactById(req, res, next) {
  try {
    const result = await contactsFunc.getContactById(req.params.id);

    if (!result) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function postContact(req, res, next) {
  try {
    const { _id: id } = req.user;
    console.log(id);
    const { error } = contactsAddSchema.validate(req.body);

    if (error) {
      const error = new Error('missing fields');
      error.status = 400;
      throw error;
    }

    const { name, email, phone, favorite } = req.body;
    const result = await contactsFunc.addContact(
      name,
      email,
      phone,
      favorite,
      id
    );

    if (!result) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const result = await contactsFunc.removeContact(req.params.contactId);

    if (!result) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    if (result === 'Not found') {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
}

async function putContactById(req, res, next) {
  try {
    const { error } = contactsAddSchema.validate(req.body);

    if (error) {
      const error = new Error('missing fields');
      error.status = 400;
      throw error;
    }

    const result = await contactsFunc.updateContact(
      req.params.contactId,
      req.body
    );

    if (!result) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function updateStatusFavoriteContact(req, res, next) {
  try {
    const result = await contactsFunc.updateStatusContact(
      req.params.contactId,
      req.body
    );

    if (!result) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    if (result === 'missing field favorite') {
      return res.status(400).json({ message: 'missing field favorite' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllContacts,
  getOneContactById,
  postContact,
  deleteContact,
  putContactById,
  updateStatusFavoriteContact,
};
