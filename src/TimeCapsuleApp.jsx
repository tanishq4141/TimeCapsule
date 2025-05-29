import React, { useState } from 'react';
import { Gift, User, Clock, Calendar, MessageCircle } from 'lucide-react';

const TimeCapsuleApp = () => {
  const [formData, setFormData] = useState({
    friendName: '',
    friendPhone: '',
    message: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveToTxt = () => {
    const { friendName, friendPhone, message, scheduledDate, scheduledTime } = formData;

    if (!friendName || !friendPhone || !message || !scheduledDate || !scheduledTime) {
      alert('Please fill in all fields');
      return;
    }

    const content =
      `Name: ${friendName}\n` +
      `Phone: ${friendPhone}\n` +
      `Message: ${message}\n` +
      `Date: ${scheduledDate}\n` +
      `Time: ${scheduledTime}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `TimeCapsule_${friendName}_${Date.now()}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <Gift className="w-8 h-8 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Time Capsule</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="inline w-4 h-4 mr-1" />
              Friend's Name
            </label>
            <input
              type="text"
              name="friendName"
              value={formData.friendName}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📱 WhatsApp Number</label>
            <input
              type="tel"
              name="friendPhone"
              value={formData.friendPhone}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageCircle className="inline w-4 h-4 mr-1" />
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 border rounded-lg resize-none"
              placeholder="Write your message..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Delivery Date
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline w-4 h-4 mr-1" />
              Delivery Time
            </label>
            <input
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <button
            onClick={saveToTxt}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Save Time Capsule as TXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeCapsuleApp;