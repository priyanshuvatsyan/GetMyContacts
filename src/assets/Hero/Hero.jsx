import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import './Hero.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Hero() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectContact, setSelectContact] = useState(null);
  const [showPop, SetShowPop] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updateName, setUpdateName] = useState('');
  const [updateMobile, setUpdateMobile] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [isAdding, setisAdding] = useState(false);
  const [newName, setnewName] = useState('');
  const [newMobile, setnewMobile] = useState('');
  const [newgmail, setnewgmail] = useState('');
  const [newGroup, setNewGroup] = useState(''); // New group field for adding contacts
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedGroup, setSelectedGroup] = useState('All'); // Group filter state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {

        const user = auth.currentUser;
        if (!user) {
          navigate('/')
        }

        const contactCollection = collection(db, 'contacts');
        const contactSnapshot = await getDocs(contactCollection);
        const contactList = contactSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(contact => contact.uid === user.uid);
        setContacts(contactList);
        setFilteredContacts(contactList); // Initialize filteredContacts with all contacts
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  // Filter contacts by group
  const filterByGroup = (group) => {
    setSelectedGroup(group);
    if (group === 'All') {
      setFilteredContacts(contacts); // Show all contacts
    } else {
      const filtered = contacts.filter(contact => contact.group === group);
      setFilteredContacts(filtered);
    }
  };

  // Search filter handler
  const handleSearch = (event) => {
    const searchInput = event.target.value.toLowerCase();
    setSearchQuery(searchInput);

    if (searchInput === '') {
      filterByGroup(selectedGroup); // Apply group filter again when search is cleared
    } else {
      const filtered = contacts.filter(contact =>
        (contact.Name && contact.Name.toLowerCase().includes(searchInput)) ||
        (contact.mobile && contact.mobile.includes(searchInput)) ||
        (contact.gmailid && contact.gmailid.toLowerCase().includes(searchInput))
      );
      setFilteredContacts(filtered);
    }
  };

  const handleClick = contact => {
    setSelectContact(contact);
    SetShowPop(true);
    setIsEditing(false);
    setUpdateName(contact.Name);
    setUpdateMobile(contact.mobile);
    setUpdateEmail(contact.gmailid);
  };

  const closePopup = () => {
    SetShowPop(false);
  };

  const closeAddPopup = () => {
    setisAdding(false);
  };

  const handleDelete = async () => {
    if (selectContact && selectContact.id) {
      try {
        await deleteDoc(doc(db, 'contacts', selectContact.id));
        setContacts(contacts.filter(contact => contact.id !== selectContact.id));
        SetShowPop(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSave = async () => {
    if (selectContact && selectContact.id) {
      try {
        const contactRef = doc(db, 'contacts', selectContact.id);
        await updateDoc(contactRef, {
          Name: updateName,
          mobile: updateMobile,
          gmailid: updateEmail,
        });
        setContacts(
          contacts.map(contact =>
            contact.id === selectContact.id
              ? { ...contact, Name: updateName, mobile: updateMobile, gmailid: updateEmail }
              : contact
          )
        );
        SetShowPop(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAddContact = async () => {
    const isDuplicate = contacts.some(contact => contact.Name === newName || contact.mobile === newMobile || contact.gmailid === newgmail);
    if (isDuplicate) {
      alert('This contact already exists. Please add a unique contact.');
      return;
    }

    try {
      const user = auth.currentUser;
      const newContact = { Name: newName, mobile: newMobile, gmailid: newgmail, group: newGroup,uid: user.uid }; // Add group to the new contact
      const contactCollection = collection(db, 'contacts');
      const docRef = await addDoc(contactCollection, newContact);
      setContacts([...contacts, { ...newContact, id: docRef.id }]);
      setisAdding(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.log(error);
    }

    //downloadable file
  };
  const downloadContacts = () =>{
    // Convert the contacts array to CSV format
    const csvContent = [
      ['Name','Mobile','Email','Group'],
      ...contacts.map(contact=>[contact.Name,contact.mobile,contact.gmailid,contact.group])
    ]
    .map(e=>e.join(','))
    .join('\n');

    // Create a blob from the CSV content
    const blob = new Blob([csvContent],{type:'text/csv;charset=utf-8'});

    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href',url);
    link.setAttribute('download','contact.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link) // Clean up the DOM after the download
  }
  // Function to handle menu button, close button, and Addbtn logic
const menu = () => {
  // Get references to elements
  let navContainer = document.getElementsByClassName('nav-container');
  let menubtn = document.getElementsByClassName('bi-list');
  let closebtn = document.getElementsByClassName('bi-x-lg');
  let Addbtn = document.getElementById('add-contact-btn-id')// Add button

  // Event listener for menu button (bi-list) to show the nav container and hide Addbtn
  for (let i = 0; i < menubtn.length; i++) {
    menubtn[i].addEventListener('click', () => {
      for (let j = 0; j < navContainer.length; j++) {
        navContainer[j].style.display = 'flex'; // Show the nav container
      }
      for (let k = 0; k < Addbtn.length; k++) {
        Addbtn[k].style.display = 'none'; // Hide Add button
      }
      menubtn[i].style.display = 'none'; // Hide menu button
      closebtn[i].style.display = 'block'; // Show close button
    });
  }

  // Event listener for close button (bi-x-lg) to hide the nav container and show Addbtn
  for (let i = 0; i < closebtn.length; i++) {
    closebtn[i].addEventListener('click', () => {
      for (let j = 0; j < navContainer.length; j++) {
        navContainer[j].style.display = 'none'; // Hide the nav container
      }
      for (let k = 0; k < Addbtn.length; k++) {
        Addbtn[k].style.display = 'block'; // Show Add button
      }
      menubtn[i].style.display = 'block'; // Show menu button again
      closebtn[i].style.display = 'none'; // Hide close button
    });
  }
};



  return (
    <>
      <div className="main-container">
        <div className="nav-container">
          <div className="header">
            <i className="bi bi-x-lg"></i>
            <div className="name">
              <h2>Hey There!</h2>
            </div>
            <ul>
              <li onClick={() => filterByGroup('All')} className={selectedGroup === 'All' ? 'active' : ''}>Home</li>
              <li onClick={() => filterByGroup('Family')} className={selectedGroup === 'Family' ? 'active' : ''}>Family</li>
              <li onClick={() => filterByGroup('Friends')} className={selectedGroup === 'Friends' ? 'active' : ''}>Friends</li>
              <li onClick={() => filterByGroup('Work')} className={selectedGroup === 'Work' ? 'active' : ''}>Work</li>
            </ul>
            <p className="logout" onClick={handleLogout}>Log Out</p>
          </div>
        </div>
        <div className="container">
        <i className="bi bi-list"  onClick={menu}></i>
          <p className="All-Contacts">All Contacts</p>
          <div className="input-container">
            <input
              type="search"
              id="search"
              className="search-box"
              placeholder="Search by name, mobile, or email..."
              value={searchQuery}
              onChange={handleSearch}
            />
           <button className="download" onClick={downloadContacts}>Download</button>

          </div>
          <div className="grid">
            <div className="grid-header">
              <h4>Name</h4>
              <p>Mobile</p>
              <p>Email</p>
              <p>Group</p>
            </div>
            <div className="main-contact-container">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <div className="item" key={index} onClick={() => handleClick(contact)}>
                    <div className="contact-details">
                      <i className="bi bi-person-fill"></i>
                      <h4 className="contact-name">{contact.Name}</h4>
                      <p className="contact-mobile">{contact.mobile}</p>
                      <p className="contact-email">{contact.gmailid}</p>
                      <p className="contact-group">{contact.group}</p>
                    </div>
                    <hr />
                  </div>
                ))
              ) : (
                <p>No contacts found</p>
              )}
            </div>
          </div>
        </div>

        {showPop && selectContact && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-left">
                <i className="bi bi-person-fill"></i>
              </div>
              <hr />
              <div className="popup-right">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      placeholder="Name"
                      value={updateName}
                      onChange={e => setUpdateName(e.target.value)}
                    />
                    <input
                      type="mobile"
                      placeholder="Mobile"
                      value={updateMobile}
                      onChange={e => setUpdateMobile(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Email"
                      value={updateEmail}
                      onChange={e => setUpdateEmail(e.target.value)}
                    />
                    <button className="actionbtn save" onClick={handleSave}>Save</button>
                  </>
                ) : (
                  <>
                    <h2 className="popup-contact-name">{selectContact.Name}</h2>
                    <p className="popup-contact-mobile">Mobile: {selectContact.mobile}</p>
                    <p className="popup-contact-email">Email: {selectContact.gmailid}</p>
                    <button className="actionbtn edit" onClick={() => setIsEditing(true)}>Edit</button>
                    <button className="actionbtn delete" onClick={handleDelete}>Delete</button>
                  </>
                )}
              </div>
              <button className="close-btn" onClick={closePopup}>Close</button>
            </div>
          </div>
        )}

        {isAdding && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-left">
                <i className="bi bi-person-fill"></i>
              </div>
              <hr />
              <div className="popup-right">
                <input
                  type="text"
                  placeholder="Name"
                  value={newName}
                  onChange={e => setnewName(e.target.value)}
                />
                <input
                  type="mobile"
                  placeholder="Mobile"
                  value={newMobile}
                  onChange={e => setnewMobile(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={newgmail}
                  onChange={e => setnewgmail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Group (e.g., Family, Friends, Work)"
                  value={newGroup}
                  onChange={e => setNewGroup(e.target.value)}
                />
                <button className="actionbtn save" onClick={handleAddContact}>Add Contact</button>
              </div>
              <button className="close-btn" onClick={closeAddPopup}>Close</button>
            </div>
          </div>
        )}

        <div className="add-contact-btn">
          <button id='add-contact-btn-id' onClick={() => setisAdding(true)}>Add Contact</button>
        </div>
      </div>
    </>
  );
}
