import React, { useState } from 'react';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';

const HARDCODED_CONTACTS = [
  {
    _id: '1',
    name: 'Rahul Sharma',
    lastMessage: 'Would love to discuss internship opportunities',
    company: 'Google',
    unread: 2
  },
  {
    _id: '2',
    name: 'Priya Patel',
    lastMessage: 'Thanks for connecting!',
    company: 'Microsoft',
    unread: 0
  },
  {
    _id: '3',
    name: 'Arun Kumar',
    lastMessage: 'Let me know if you have any questions',
    company: 'Amazon',
    unread: 1
  },
  {
    _id: '4',
    name: 'Sneha Reddy',
    lastMessage: 'Great talking to you!',
    company: 'Apple',
    unread: 0
  },
  {
    _id: '5',
    name: 'Karthik M',
    lastMessage: 'Looking forward to our next chat',
    company: 'Tesla',
    unread: 3
  }
];

const SAMPLE_MESSAGES = {
  '1': [
    { id: 1, sender: 'Rahul Sharma', text: 'Hi there! How are you?', timestamp: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Hello! I\'m doing great, thanks for asking.', timestamp: '10:02 AM' },
    { id: 3, sender: 'Rahul Sharma', text: 'Would love to discuss internship opportunities at Google', timestamp: '10:05 AM' }
  ]
};

const Chat = () => {
  const [contacts] = useState(HARDCODED_CONTACTS);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const newMessageObj = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact._id]: [...(prev[selectedContact._id] || []), newMessageObj]
    }));

    setNewMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex h-[600px] bg-white rounded-lg shadow-lg">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto h-[520px]">
            {filteredContacts.map(contact => (
              <div
                key={contact._id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedContact?._id === contact._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.company}</p>
                    <p className="text-sm text-gray-600 mt-1">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg">{selectedContact.name}</h2>
                <p className="text-sm text-gray-500">{selectedContact.company}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages[selectedContact._id]?.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'me'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
