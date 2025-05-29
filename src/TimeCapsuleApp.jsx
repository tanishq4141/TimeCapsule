import React, { useState, useEffect } from 'react';
import { Clock, MessageCircle, User, Calendar, Send, Trash2, Gift } from 'lucide-react';

const TimeCapsuleApp = () => {
  const [capsules, setCapsules] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    friendName: '',
    friendPhone: '',
    message: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  // Check for capsules ready to send
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCapsules(prevCapsules => 
        prevCapsules.map(capsule => {
          const scheduledDateTime = new Date(`${capsule.scheduledDate}T${capsule.scheduledTime}`);
          if (!capsule.sent && scheduledDateTime <= now) {
            return { ...capsule, sent: true, sentAt: now.toISOString() };
          }
          return capsule;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createCapsule = () => {
    // Basic validation
    if (!formData.friendName || !formData.friendPhone || !formData.message || 
        !formData.scheduledDate || !formData.scheduledTime) {
      alert('Please fill in all fields');
      return;
    }
    
    const newCapsule = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      sent: false
    };

    setCapsules([...capsules, newCapsule]);
    setFormData({
      friendName: '',
      friendPhone: '',
      message: '',
      scheduledDate: '',
      scheduledTime: ''
    });
    setShowCreateForm(false);
  };

  const deleteCapsule = (id) => {
    setCapsules(capsules.filter(c => c.id !== id));
  };

  const sendToWhatsApp = (capsule) => {
    const message = encodeURIComponent(
      `🎁 Time Capsule Message for ${capsule.friendName}!\n\n` +
      `"${capsule.message}"\n\n` +
      `This message was scheduled on ${new Date(capsule.createdAt).toLocaleDateString()} ` +
      `to be delivered today! 💌`
    );
    
    const whatsappUrl = `https://wa.me/${capsule.friendPhone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };

  const formatDateTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    return dateTime.toLocaleString();
  };

  const getTimeUntilSend = (date, time) => {
    const scheduledTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = scheduledTime - now;
    
    if (diff <= 0) return "Ready to send!";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Time Capsule</h1>
          </div>
          <p className="text-gray-600 text-lg">Send messages to the future via WhatsApp</p>
        </div>

        {/* Create Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg flex items-center mx-auto"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Create Time Capsule
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Time Capsule</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Friend's Name
                  </label>
                  <input
                    type="text"
                    name="friendName"
                    value={formData.friendName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter friend's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📱 WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="friendPhone"
                    value={formData.friendPhone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Write your message to the future..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={createCapsule}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Create Capsule
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Capsules List */}
        <div className="space-y-4">
          {capsules.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No time capsules yet</p>
              <p className="text-gray-400">Create your first time capsule above!</p>
            </div>
          ) : (
            capsules.map(capsule => (
              <div key={capsule.id} className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
                capsule.sent ? 'border-green-200 bg-green-50' : 'border-purple-200'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      capsule.sent ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      {capsule.sent ? (
                        <Send className="w-6 h-6 text-green-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        To: {capsule.friendName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {capsule.sent ? 'Delivered' : 'Scheduled'}: {formatDateTime(capsule.scheduledDate, capsule.scheduledTime)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteCapsule(capsule.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 italic">"{capsule.message}"</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    {capsule.sent ? (
                      <span className="text-green-600 font-medium">✅ Ready to send!</span>
                    ) : (
                      <span className="text-purple-600 font-medium">
                        ⏰ Sends in: {getTimeUntilSend(capsule.scheduledDate, capsule.scheduledTime)}
                      </span>
                    )}
                  </div>
                  
                  {capsule.sent && (
                    <button
                      onClick={() => sendToWhatsApp(capsule)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send via WhatsApp
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeCapsuleApp;