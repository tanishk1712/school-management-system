import React, { useState } from 'react';
import { MessageSquare, Phone, MoreVertical, Plus, Search, FileText, Image, File, Download, Send, UserRound, AlignRight } from 'lucide-react';

// Types
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  isOnline?: boolean;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  icon: React.ReactNode;
}

const Chat: React.FC = () => {
  const [messageInput, setMessageInput] = useState('');
  const [selectedContact, setSelectedContact] = useState<string>('Florencio Dorrance');
  const [directory, setDirectory] = useState(false);


  // Sample data
  const messages: Message[] = [
    { id: '1', sender: 'Florencio Dorrance', content: 'omg, this is amazing', timestamp: '12:01 PM', isOwn: false },
    { id: '2', sender: 'Florencio Dorrance', content: 'perfect! ✅', timestamp: '12:02 PM', isOwn: false },
    { id: '3', sender: 'Florencio Dorrance', content: 'Wow, this is really epic', timestamp: '12:05 PM', isOwn: false },
    { id: '4', sender: 'You', content: 'How are you?', timestamp: '12:10 PM', isOwn: true },
    { id: '5', sender: 'Florencio Dorrance', content: 'just ideas for next time', timestamp: '12:15 PM', isOwn: false },
    { id: '6', sender: 'Florencio Dorrance', content: "I'll be there in 2 mins 🕒", timestamp: '12:16 PM', isOwn: false },
    { id: '7', sender: 'You', content: 'woohoooo', timestamp: '12:20 PM', isOwn: true },
    { id: '8', sender: 'You', content: 'Haha oh man', timestamp: '12:21 PM', isOwn: true },
    { id: '9', sender: 'You', content: "Haha that's terrifying 😂", timestamp: '12:25 PM', isOwn: true },
    { id: '10', sender: 'Florencio Dorrance', content: 'aww', timestamp: '12:30 PM', isOwn: false },
    { id: '11', sender: 'Florencio Dorrance', content: 'omg, this is amazing', timestamp: '12:35 PM', isOwn: false },
    { id: '12', sender: 'Florencio Dorrance', content: 'woohoooo 🔥', timestamp: '12:36 PM', isOwn: false },
  ];

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Florencio Dorrance', title: 'Market Development Manager', isOnline: true },
    { id: '2', name: 'Benny Spanbauer', title: 'Area Sales Manager' },
    { id: '3', name: 'Jamel Eusebio', title: 'Administrator' },
    { id: '4', name: 'Lavern Laboy', title: 'Account Executive' },
    { id: '5', name: 'Alfonzo Schuessler', title: 'Proposal Writer' },
    { id: '6', name: 'Daryl Nehls', title: 'Nursing Assistant' },
  ];

  const recentChats = [
    { id: '1', name: 'Elmer Laverty', message: 'Haha oh man 🔥', time: '12m', tags: ['Question', 'Help wanted'] },
    { id: '2', name: 'Florencio Dorrance', message: 'woohoooo', time: '24m', tags: ['Some content'] },
    { id: '3', name: 'Lavern Laboy', message: "Haha that's terrifying 😂", time: '1h', tags: ['Bug', 'Hacktoberfest'] },
    { id: '4', name: 'Titus Kitamura', message: 'omg, this is amazing', time: '5h', tags: ['Question', 'Some content'] },
    { id: '5', name: 'Geoffrey Mott', message: 'aww 😍', time: '2d', tags: ['Request'] },
    { id: '6', name: 'Alfonzo Schuessler', message: 'perfect!', time: '1m', tags: ['Follow up'] },
  ];

  const files: FileItem[] = [
    { id: '1', name: 'i9.pdf', type: 'PDF', size: '9mb', icon: <FileText className="h-5 w-5 text-red-500" /> },
    { id: '2', name: 'Screenshot-3817.png', type: 'PNG', size: '4mb', icon: <Image className="h-5 w-5 text-green-500" /> },
    { id: '3', name: 'sharefile.docx', type: 'DOC', size: '559kb', icon: <FileText className="h-5 w-5 text-blue-500" /> },
    { id: '4', name: 'Jerry-2020_I-9_Form.xxl', type: 'XXL', size: '24mb', icon: <File className="h-5 w-5 text-purple-500" /> },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, you would add the message to the state
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[95vh]">
      {/* Left sidebar - Message list */}
      <div className="w-72 border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold ml-2">Messages</h2>
            <span className="bg-gray-200 rounded-full px-2 text-xs ml-2">12</span>
          </div>
          <button className="text-blue-500 bg-blue-100 rounded-full p-1">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="p-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full bg-gray-100 rounded-md py-2 pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 hover:bg-gray-100 cursor-pointer ${chat.name === selectedContact ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedContact(chat.name)}
            >
              <div className="flex">
                <UserRound className="h-10 w-10 text-gray-400" />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{chat.name}</span>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {chat.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded ${tag === 'Question' ? 'bg-orange-100 text-orange-700' :
                            tag === 'Help wanted' ? 'bg-green-100 text-green-700' :
                              tag === 'Bug' ? 'bg-orange-100 text-orange-700' :
                                tag === 'Hacktoberfest' ? 'bg-teal-100 text-teal-700' :
                                  tag === 'Request' ? 'bg-green-100 text-green-700' :
                                    tag === 'Some content' ? 'bg-blue-100 text-blue-700' :
                                      tag === 'Follow up' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle section - Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <UserRound className="h-8 w-8 text-gray-400" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{selectedContact}</h3>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <div>
            <button className="text-indigo-500 rounded-full p-2 hover:bg-indigo-50">
              <AlignRight onClick={() => { setDirectory(true) }} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isOwn && (
                <UserRound className="h-8 w-8 text-gray-400 mr-2 self-end" />
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${message.isOwn
                    ? 'bg-indigo-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t">
          <div className="relative flex items-center">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message"
              className="w-full border rounded-full py-2 pl-4 pr-10"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-2 text-indigo-500"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar - Directory */}
      {directory && (
        <div className="w-72 border-l flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Directory</h2>
              <button>
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Team Members</h3>
              <span className="bg-gray-200 rounded-full px-2 text-xs">6</span>
            </div>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center">
                  <div className="relative">
                    <UserRound className="h-8 w-8 text-gray-400" />
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm">Files</h3>
              <span className="bg-gray-200 rounded-full px-2 text-xs">125</span>
            </div>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {file.icon}
                    <div className="ml-3">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.type} · {file.size}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Chat;