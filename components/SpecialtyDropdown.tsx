import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SpecialtyDropdownProps {
  selectedSpecialty: string;
  onSelect: (specialty: string) => void;
  placeholder?: string;
}

const MEDICAL_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'General Practice',
  'Gynecology',
  'Hematology',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology',
  'Pathology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Surgery',
  'Urology',
];

export const SpecialtyDropdown: React.FC<SpecialtyDropdownProps> = ({
  selectedSpecialty,
  onSelect,
  placeholder = 'Select your specialty',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpecialties = MEDICAL_SPECIALTIES.filter(specialty =>
    specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (specialty: string) => {
    onSelect(specialty);
    setIsOpen(false);
    setSearchQuery('');
  };

  const renderSpecialtyItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="py-4 px-4 border-b border-gray-100"
      onPress={() => handleSelect(item)}
    >
      <Text className="text-gray-900 text-base">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex-row items-center justify-between"
        onPress={() => setIsOpen(true)}
      >
        <Text
          className={`text-base ${
            selectedSpecialty ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {selectedSpecialty || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl mx-6 max-h-96 w-80">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-900">
                Select Specialty
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
                <Ionicons name="search" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-900"
                  placeholder="Search specialties..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
              </View>
            </View>

            {/* Specialty List */}
            <FlatList
              data={filteredSpecialties}
              renderItem={renderSpecialtyItem}
              keyExtractor={(item) => item}
              style={{ maxHeight: 250 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
