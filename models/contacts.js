const mongoose = require('mongoose');

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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Contact = mongoose.model('Contact', contactsSchema);

async function listContacts(owner) {
  const data = await Contact.find({ owner });

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

async function addContact(name, email, phone, favorite, owner) {
  const contacts = await Contact.create({
    name,
    email,
    phone,
    favorite,
    owner,
  });

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
