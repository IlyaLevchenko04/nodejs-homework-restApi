const express = require('express');
const Joi = require('joi');
const contactsFunc = require('../../models/contacts');

const router = express.Router();

const contactsAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contactsFunc.listContacts();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
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
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactsAddSchema.validate(req.body);

    if (error) {
      const error = new Error('missing fields');
      error.status = 400;
      throw error;
    }

    const { name, email, phone } = req.body;
    const result = await contactsFunc.addContact(name, email, phone);

    if (!result) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
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
});

router.put('/:contactId', async (req, res, next) => {
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
});

router.patch('/:contactId/favorite', async (req, res, next) => {
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
});

module.exports = router;
