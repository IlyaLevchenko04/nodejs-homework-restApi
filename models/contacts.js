const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, '/contacts.json');
const updateFile = async data => {
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
};

async function listContacts() {
  const data = await fs.readFile(contactsPath, 'utf-8');

  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  const data = JSON.parse(contacts);
  const result = data.find(contact => contactId === contact.id);

  return result || null;
}

async function removeContact(contactId) {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  const data = JSON.parse(contacts);
  const index = data.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = await data.splice(index, 1);
  updateFile(data);

  return result;
}

async function addContact(name, email, phone) {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  const data = JSON.parse(contacts);
  const newContact = {
    name,
    email,
    phone,
    id: nanoid(),
  };
  data.push(newContact);
  updateFile(data);

  return newContact;
}

async function updateContact(contactId, body) {
  const contacts = await fs.readFile(contactsPath, 'utf-8');
  const data = JSON.parse(contacts);

  const index = data.findIndex(({ id }) => id === contactId);

  if (index === -1) {
    return null;
  }

  data[index] = { ...body, id: contactId };

  updateFile(data);

  return data[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
