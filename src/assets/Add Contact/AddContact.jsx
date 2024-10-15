import React, { useState } from 'react';
import AddContact from './AddContact';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddContact = (contact) => {
    setContacts([...contacts, contact]);
  };

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>Add Contact</button>
      <AddContact
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddContact}
      />
      <ul>
        {contacts.map((contact, index) => (
          <li key={index}>{contact.name} - {contact.phoneNumber}</li>
        ))}
      </ul>
    </div>
  );
}
