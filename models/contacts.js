const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');

const contactsPath = path.join(__dirname, '/contacts.json');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model('Contact', contactsSchema);

async function listContacts() {
  const data = await Contact.find();

  return data;
}

async function getContactById(contactId) {
  const contacts = await Contact.findById(`${contactId}`);

  return contacts || null;
}

async function removeContact(contactId) {
  const contact = await Contact.findByIdAndDelete(`${contactId}`);
  return contact;
}

async function addContact(name, email, phone) {
  const contacts = await Contact.create({ name, email, phone });

  return contacts;
}

async function updateContact(contactId, body) {
  const contacts = await Contact.findByIdAndUpdate(
    `${contactId}`,
    { ...body },
    { new: true }
  );

  return contacts;
}

async function updateStatusContact(contactId, body) {
  if (Object.keys(body).includes('favorite')) {
    const data = await Contact.findByIdAndUpdate(
      `${contactId}`,
      { favorite: body.favorite },
      { new: true }
    );

    return data;
  }

  return 'missing field favorite';
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
