import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  StatusBar,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

// የምርቶች ናሙና መረጃ (Product Data)
const PRODUCTS = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra',
    price: '$1,299',
    category: 'Samsung',
    specs: '256GB | 12GB RAM | Titanium',
    image: 'https://via.placeholder.com/150/000000/FFFFFF?text=S24+Ultra',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    price: '$1,199',
    category: 'Apple',
    specs: '256GB | Natural Titanium',
    image: 'https://via.placeholder.com/150/333333/FFFFFF?text=iPhone+15',
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    price: '$999',
    category: 'Google',
    specs: '128GB | Obsidian Black',
    image: 'https://via.placeholder.com/150/555555/FFFFFF?text=Pixel+8',
  },
  {
    id: '4',
    name: 'Xiaomi 14 Ultra',
    price: '$1,099',
    category: 'Xiaomi',
    specs: '512GB | 16GB RAM',
    image: 'https://via.placeholder.com/150/777777/FFFFFF?text=Xiaomi+14',
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ሁሉም');

  const categories = ['ሁሉም', 'Apple', 'Samsung', 'Google', 'Xiaomi'];

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ሁሉም' || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrder = (productName) => {
    Alert.alert(
      'የትዕዛዝ ጥያቄ',
      `${productName} ለማዘዝ ወደ ቴሌግራም/ስልክ መስመራችን ሊዛወሩ ነው::`,
      [
        { text: 'ሰርዝ', style: 'cancel' },
        { text: 'ቀጥል', onPress: () => console.log('Order initiated') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header (የላይኛው መሪ) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>Jemal Mobile</Text>
          <Text style={styles.brandSubtitle}>የተረጋገጡ አዳዲስና ጽዱ ስልኮች</Text>
        </View>
        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => Alert.alert('እገዛ', 'በቁጥር 0911XXXXXX ይደውሉልን')}
        >
          <Text style={styles.contactBtnText}>ደውል</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Search & Filter Bar (የፍለጋ እና ምድብ ማጣሪያ) */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="ስልክ በስም ፈልግ..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={{ height: 45, marginBottom: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Product Catalog List (የምርቶች ዝርዝር) */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={width > 600 ? 3 : 2} // ለትልቅ ስክሪን/ታብሌት 3፣ ለስልክ 2 አድርጎ ያስተካክላል
        key={width > 600 ? 'GRID_3' : 'GRID_2'}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.productTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.productSpecs} numberOfLines={1}>
                {item.specs}
              </Text>
              <Text style={styles.productPrice}>{item.price}</Text>

              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => handleOrder(item.name)}
              >
                <Text style={styles.orderButtonText}>እዘዝ / መረጃ</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// 4. Styles (ለሁሉም ስልክ መጠኖች የሚስማማ ዲዛይን)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  contactBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#E2E8F0',
  },
  cardContent: {
    padding: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  productSpecs: {
    fontSize: 11,
    color: '#64748B',
    marginVertical: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#16A34A',
    marginVertical: 4,
  },
  orderButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
