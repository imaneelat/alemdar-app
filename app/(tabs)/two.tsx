import { View, TextInput, StyleSheet, FlatList, Text, useColorScheme } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

 const data = ['Solar', 'Electronics', 'Arduino', 'Sound','Chargers','Adapters','Lamps','Filaments','TV remotes' ,'Mexxsun','Fans','electric','SprayGum','Screwdrivers'];

  const handleSearch = (text: string) => {
    setQuery(text);
    const filtered = data.filter(item =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
      ]}
    >
      {/* Search bar with icon */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0',
            borderColor: colorScheme === 'dark' ? '#333' : '#ccc',
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={colorScheme === 'dark' ? '#888' : '#555'}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[
            styles.searchBar,
            { color: colorScheme === 'dark' ? '#fff' : '#000' },
          ]}
          placeholder="Search items ..."
          placeholderTextColor={colorScheme === 'dark' ? '#888' : '#555'}
          value={query}
          onChangeText={handleSearch}
          autoFocus={true}
        />
      </View>

      {/* Results list */}
      <FlatList
        data={results}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text
            style={{
              color: colorScheme === 'dark' ? '#fff' : '#000',
              fontSize: 18,
              paddingVertical: 8,
            }}
          >
            {item}
          </Text>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: colorScheme === 'dark' ? '#333' : '#ccc',
              marginVertical: 4,
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
});



